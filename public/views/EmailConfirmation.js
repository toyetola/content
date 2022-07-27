
const version = "v1"
const emailfunc = (rootUrl, user, confirmationcode)=>{
    return `<h1>Password Reset Confirmation</h1>
    <h2>Hello ${user}</h2>
    <p>A password reset was request for your account. Use the link below it this was you, take no action if not but report to us.</p>
    <a href="${rootUrl}/api/${version}/reset/${confirmationcode}"> Click here</a>
    </div>`
}

module.exports = emailfunc