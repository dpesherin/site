export class UserModel
{
    id
    login
    active
    email
    name
    lastname
    password
    role
    date_create

    constructor(data = {})
    {
        Object.assign(this, data)
    }
}