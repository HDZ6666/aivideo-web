<template>
    <div>
        <el-upload
            action="#"
            list-type="picture-card"
            :multiple="false"
            :file-list="fileList"
            :before-upload="handleBeforeUpload"
            accept="image/png,image/jpg"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :http-request="customUpload"
            :on-exceed="handleOnexceed"
            :limit="1"
            >
            <i class="el-icon-plus"></i>
            <!-- <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" :modal="false">
                <img width="100%" :src="imgUrl" alt="">
            </el-dialog>
    </div>
</template>
<script>
export default{
    props:{
        // dialogVisible:{
        //     type:Boolean,
        //     default:false
        // },
        // imgBase64Url:{
        //     type:String,
        //     default:""
        // },
        fileList:{
            type:Array,
            default:()=>[]
        }
    },
    data(){
        return{
            imgUrl:"",
            dialogVisible:false
        }
    },
    mounted(){
        // this.imgUrl = this.imgBase64Url||'';
        // console.log(this.imgBase64Url)
        // debugger
    },
    watch:{
        imgBase64Url(val){
            //this.imgUrl = val||''
        }
    },
    methods:{
        handleBeforeUpload(file,fileList) {
        // 可以在这里进行文件类型的检查
        debugger
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            this.$message.error('只能上传图片文件!');
            return false;
        }
            return true;
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.imgUrl = "";
            this.dialogVisible = false;
            this.$emit('changeImgUrl',this.imgUrl)
        },
        handlePictureCardPreview(file) {
            this.imgUrl = file.url;
            this.$emit('changeImgUrl',this.imgUrl)
            this.dialogVisible = true;
        },
        handleOnexceed(){
            this.$message.error("最多只能上传一张图片")
        },
        customUpload(options) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imgUrl = e.target.result;
                this.$emit('changeImgUrl',this.imgUrl)
                // 这里可以将 base64 字符串发送到服务器
                console.log(this.imgUrl);
                this.$message.success("上传成功")
            };
            reader.readAsDataURL(options.file);
        },
    }
}
</script>
<style scoped>
/* /deep/ .el-upload--picture-card {
    height: 74px;
    width: 74px;
    line-height: 74px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
    height: 74px;
    width: 74px;
} */
</style>