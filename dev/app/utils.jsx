import { parse, NodeType } from 'node-html-parser';
import {intersection as _intersection, union as _union} from "lodash"

var MIN_SIMILARITY = 0.6

const getShingles = (text, k=2, lower=true) => {
    var out = Object()
    var key
    text = lower ? text.toLowerCase() : text
    for (var i = 0; i < text.length - k; i++ ) {
        key = text.substring(i, i + k)
        out[key]++
    }
    return Object.keys(out);
}

const parseHtml = (htmlText) => {
    const root = parse(htmlText)
    const divs = root.querySelectorAll('div.appSubPanel')
    let notes = divs.reduce((acc, item, id) => {
        
        let title = item.querySelector('div.aspTitle').textContent
        let body = item.querySelector('div.appCssGrid h6').text
        let title_match = title.match(/Posted for: (.+), on ([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}).+/)
        if (title_match != null) {
            acc.push({source: title_match[1], date: new Date(title_match[2]), body, id:(id - 1)})
        }
        return acc
        
    }, [])
     return notes
}

const prepareNotes = (results) => {
    let notes
    try {
        let id = -1
        notes = JSON.parse(results).map(note => {
            // console.log(note)
            let title_match = note.posted_for.match(/(.+) +on +([0-9]{2}-[A-Za-z]{3}-[0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2} ?([APM]+)?)/)
            id++;
            let body = note.remark.replaceAll('\u003cbr\u003e', '\n')
            return {source: title_match[1], date: new Date(title_match[2]), body, id}
        })
        // console.log(notes)
    } catch (error) {
        console.error("issue with notes Json parsing", error)
    }
    if (notes == undefined) {
        try {
            notes = parseHtml(results)
        } catch {
            console.error("issue with notes HTML parsing")
        }
    }

    notes = notes.map(note => ({...note, hash2: getShingles(note.body), hash3: getShingles(note.body, 3)}))

    const matrix = notes.reduce((acc, lnote) => {
        if (acc.rest[lnote.id]){
            acc.notes.push(notes.slice(lnote.id + 1).reduce((nacc, rnote) => {
                if (acc.rest[rnote.id]){
                    let jd = _intersection(lnote.hash2, rnote.hash2).length/_union(lnote.hash2, rnote.hash2).length
                    if (jd >= MIN_SIMILARITY) {
                        nacc.push(rnote.id)
                        acc.rest[rnote.id] = false
                    }
                }
                return nacc
            }, [lnote.id]))
        } 
        
        return acc
    }, {rest: [...Array(notes.length)].map(i => true), notes: []})

    return {notes, matrix: matrix.notes}
}

export {getShingles, parseHtml, prepareNotes}
