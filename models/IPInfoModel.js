export class IPInfoModel
{
    ip
    city
    region
    country
    code
    emoji
    lat
    lon
    timezone

    constructor(data = {})
    {
        Object.assign(this, data)
    }
}