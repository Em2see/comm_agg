import request from 'superagent'
import {get as _get} from "lodash"

export const root_path = process.env.DEF_PATH_ENV

let url

if (process.env.VERSION == "NEW") {
	url = "https://internal.site.com/Remarks"
} else {
	url = "https://internal.site-old.com/Remarks"
}


let StatusNotes = process.env.NODE_ENV == "development" ? process.env.VERSION == "NEW" ? "/Remarks2" : "/Remarks2" : url

let params = (ckt, version) => process.env.VERSION == "NEW" ? "orderNumber=" + ckt +"&orderVerion=" + version : "id=Remarks&orderNum=" + ckt +"&orderVer=" + version 


export const get_notes = (ckt, version) =>
	request.get(StatusNotes)
		.query(params(ckt, version))
		.then(
			(resp)=>{
				//console.log(resp.body)
			    return resp.text
			},
			(err) => {
				throw 'we go error in noty getter'
			}
		)
