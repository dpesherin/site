export class ScheduleModel
{
    id
    name
    description
    user_id
    date

    constructor(data = {})
    {
        Object.assign(this, data)
    }
}