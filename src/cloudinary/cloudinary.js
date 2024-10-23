const cloudinary=require('cloudinary').v2;
const dotenv=require('dotenv');
dotenv.configDotenv();

cloudinary.config(
    {
        cloud_name:process.env.CLOUDINARY_NAME,
        api_key:process.env.API_KEY,
        api_secret:process.env.API_SECRET,
    }
)

let uploadeProfileImage=async(file,path,name)=>{
    try{
        let data=await cloudinary.uploader.upload(file,{
            folder:path,
            public_id:name,
        });
        return data;

    }
    catch(error){
        console.log(error);
        throw error;
    }
}
module.exports=uploadeProfileImage