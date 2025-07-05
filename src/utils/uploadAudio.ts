import axios from "axios";

export default async function audioUploadUtill(data : {file : File,roomId:string}){
    try{
        const response = await axios.post('/api/audio-upload',data);
        

    }
    catch(e){

    }


}