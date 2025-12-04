export class AccessCodesModel
{
    id
    guid
    code
    expires_at
    user_id

    constructor(data = {})
    {
        Object.assign(this, data)
    }
}