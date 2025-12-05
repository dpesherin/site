import { IPInfoModel } from "../models/IPInfoModel.js"

export class TwoIPIntegration
{
    _host
    _token
    _ip

    constructor(ip)
    {
        this._host = process.env.TWOIP_HOST
        this._token = process.env.TWOIP_TOKEN
        this._ip = ip
    }

    async getGeoInfo()
    {
        console.log(`${this._host}/${this._ip}?token=${this._token}`)
        let response = await fetch(`${this._host}/${this._ip}?token=${this._token}`, {
            method: "GET",
             headers: {
                'Content-Type': 'application/json',
            }
        })
        return new IPInfoModel(await response.json())
    }
}