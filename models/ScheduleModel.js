export class ScheduleModel
{
    id
    name
    description
    date_create
    user_id
    application_id
    status
    date

    constructor(data = {})
    {
        Object.assign(this, data)
    }
}