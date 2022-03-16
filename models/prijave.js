const boolean = require("@hapi/joi/lib/types/boolean");
const mongoose = require("mongoose");
const prijavaShema = new mongoose.Schema({
    imePrezime:{
        type: String, 
        required: [true, 'Morate uneti ime i prezime']
    },
    emailPriv:{
        type: String, 
        required: [true, 'Morate uneti pravi email']
    },
    emailFon:{
        type: String,
    },
    zelje:{
        type: {
            panel:{
                type: Boolean
            },
            techChallenge:{
                type:  Boolean
            },
            speedDating:{
                type: String
            },
            radionica:{
                type: boolean
            } 
        },
        required:true
    },
    pitanja:[{
        pitanje1:{
            type:{
                odgovor: {
                    type: String,
                   required:true
                },
                ocena:{
                    type: Number,
                    min: 1,
                    max:10,
                    default:0
                }
               
            }
        },pitanje2:{
            type:{
                odgovor: {
                    type: String,
                   required:true
                },
                ocena:{
                    type: Number,
                    min: 1,
                    max:10,
                    default:0
                }
               
            }
        }, 
    }]
    

})