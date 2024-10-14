import { onMounted ,computed,reactive} from "vue"
export let recordArea = reactive({list:[]})
export const addShapeArea = (id,area)=>{
    const result = recordArea.list.find((item)=>item.id==id); // 之前没有绘制这个图形
    if(result){
     recordArea.list.map((item)=>{
       if(item.id==id){
         item.area = area
       }
     })
    }else{
     recordArea.list.push({
       id,
       area
     })
    }
}