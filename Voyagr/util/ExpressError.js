class ExpressError1 extends Error{
    constructor(status,message){
        super(message)
        this.status=status
    }
}
module.exports=ExpressError1