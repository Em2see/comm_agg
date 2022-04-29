import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import {Grid, Button} from 'semantic-ui-react'
import {Comments} from './components'
import {get_notes} from './api'
import {prepareNotes} from './utils'


const divContainer = {
    position: 'fixed',
    top: '20%',
    left: "3%",

}


const App = (props) => {
    
    const [state, setState] = React.useState(
        {
            loading: true,
            visible: false,
            ckt: '',
            version: '',
            notes: [],
            style: {}
        }
    )

    const onClick = () => {
        let newState = {
            ...state,
            visible: !state.visible
        }
        if (!state.visible) {
            newState = {
                ...newState,
                ckt: props.root.getAttribute('data-ckt'),
                version: props.root.getAttribute('data-version'),
                style: {
                    ...state.style,
                    overflowY: 'scroll',
                    border: "1px solid",
                    borderRadius: "2px"
                }
            }
        } else {
            newState = {
                ...newState,
                style: {}
            }
        }
        setState(newState)
    }

    useEffect(()=> {
        console.log('useEffect')
        if (state.loading && state.ckt != "" && state.version != "") {
            get_notes(state.ckt, state.version)
                .then((result) => {
                    let notes = prepareNotes(result)
                    setState({
                        ...state,
                        loading: false,
                        visible: true,
                        ...notes
                    })
            })
        }
    })

    return (
        <div style={divContainer}>
    <Grid verticalAlign='middle'>
        <Grid.Row>
            <Grid.Column width={1}  floated='left'>
                <Button circular floated='left' color='blue' icon='settings' onClick={onClick}/>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column width={16} floated='left'>
                <div style={{height: '500px', ...state.style}}>
                    {state.visible ?
                        <Comments {...state}/>
                    : null }
                </div>
            </Grid.Column>
        </Grid.Row>
        
    </Grid>
    </div>
    )
}

const render = () => {
    let root_dom

    console.log(document.title)

    try {
        root_dom = document.getElementById("root")
    }
    catch(err) {
        console.log('element is not found')
    }

    if (root_dom) {
        console.log('check')
    } else {
        root_dom = document.createElement("div")
        root_dom.setAttribute('id', 'root')
        root_dom.setAttribute('data-ckt', '')
        root_dom.setAttribute('data-version', '')
        document.body.appendChild(root_dom)
    }
    ReactDOM.render(<App root={root}/>, root);   
}

render()
