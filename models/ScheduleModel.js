export class ScheduleModel
{
    id
    name
    description
    user_id
    application_id
    status
    date

    constructor(data = {})
    {
        Object.assign(this, data)
    }
}