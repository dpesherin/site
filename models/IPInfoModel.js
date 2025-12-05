export class IPInfoModel
{
    ip="127.0.0.1"
    city="Locahost"
    region="Locahost"
    country="Locahost"
    code="Locahost"
    emoji="Locahost"
    lat="Locahost"
    lon="Locahost"
    timezone="Locahost"

    constructor(data = {})
    {
        Object.assign(this, data)
    }
}