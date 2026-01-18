export class ApplicationModel
{
    id
    name
    lastname
    priority_contact
    description
    date
    user_id
    agreement_confirmed
    date_create
    status

    constructor(data = {})
    {
        Object.assign(this, data)
    }
}