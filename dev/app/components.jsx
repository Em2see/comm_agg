import React,{Component, useState, useEffect} from 'react'
import {Segment, Checkbox, Dimmer, Loader, Breadcrumb, Header} from 'semantic-ui-react'
import {get as _get} from 'lodash'
import {DateTime} from "luxon"
import {diffLines} from "diff"

const styles = {
    del: {
        textDecoration: "none",
        color: "#b30000",
        background: "#fadad7"
    },
    ins: {
        background: "#eaf2c2",
        color: "#406619",
        textDecoration: "none",
    }
}

const Comments = (props) => {
    console.log(props)
    return <Segment>
            <Dimmer active={props.loading}>
                <Loader>Loading</Loader>
            </Dimmer>

            <Checkbox toggle label='Chained' checked={true}/>
            <Checkbox toggle label='Сollapse' checked={true}/>
            {(!props.loading) ?
                <CommentsList {...props}/>
            : null}       
        </Segment>
}

const CommentsList = (props) => {
    let notes_data = _get(props, "notes", [])
    let notes = _get(props, "matrix", []).map((note) => note.map(i => notes_data[i]))
    return notes.map((notes_list, i) => 
        <Comment key={i} notes={notes_list} />    
    )   
}

const BCrumbs = (props) => {
    return <Breadcrumb>
        {props.notes.map((note, i)=> <React.Fragment key={note.id}>
            <Breadcrumb.Section
                link={props.active != i}
                style={((props.current == i)? {...styles.ins, "textDecorationLine": "underline"} : (props.prev == i)? styles.del : null)}
                active={props.active == i}
                onClick={()=>props.onClick(i)}
            >
                {DateTime.fromJSDate(note.date).toFormat('MM/dd/yyyy')}
            </Breadcrumb.Section>
            {(i < props.notes.length - 1) ? <Breadcrumb.Divider/> : null}
        </React.Fragment>)}
    </Breadcrumb>
}

const prepareDiff = (lnote, rnote) => {
    const diff = diffLines(rnote.body, lnote.body)
    return diff.reduce((acc, part, i) => {
        let style = part.added ? styles.ins : part.removed ? styles.del : null;
        acc.push(<span key={lnote.id + "_" + i} style={style}>{part.value}</span>)
        return acc
    }, [])
}

const calcPrev = (current, notesQty) => 
    (current + 1 >= notesQty) ? (current - 1 < 0) ? current : current - 1 : current + 1

const Comment = (props) => {
    let [current, updateCurrent] = useState(0)
    // let note = props.notes[state.current]
    let prev = calcPrev(current, props.notes.length)
    let note = prepareDiff(props.notes[current], props.notes[prev])
    useEffect(() => {
        prev = calcPrev(current, props.notes.length)
        note = prepareDiff(props.notes[current], props.notes[prev])
    }, [current])
    
    return <Segment>
            <BCrumbs 
                notes={props.notes}
                current={current}
                prev={prev}
                active={current}
                onClick={(i)=>updateCurrent(i)}
                />
            <Segment style={{whiteSpace: "pre-wrap"}}>
                {note}
            </Segment>
            
        </Segment>
}

export {Comments}