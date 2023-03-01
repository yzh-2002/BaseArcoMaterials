import { Form,DatePicker,Button } from "antd";
import React,{ useCallback } from "react";
import dayjs from "dayjs";

const { RangePicker } =DatePicker
const MAX_ACTIVITY =3;

const INFO_MAP ={
    'UNWHOLE':'请完整填写日期！',
    'TOOLATE':'请保证当前任务时间早于后续任务！',
    'TOOEARLY':'请保证当前任务时间晚于先前任务！'
}

export default function Index(){
    const [form] =Form.useForm()
    const checkTime =useCallback((order:number,fn:(field:string)=>number[])=>{
        let totalTimes:Array<number> =[]
        for(let i=0;i<MAX_ACTIVITY;i++){
            totalTimes=totalTimes.concat((fn('Activity'+i) || [0,0]).map(date=>(dayjs(date).valueOf())))
        }
        if (order===0){
            // 其结束时间应该比后续任务时间中最小的小
            const endTarget =totalTimes[1*2-1];
            const minAfter =Math.min(...totalTimes.slice(1*2,MAX_ACTIVITY*2));
            if (endTarget===0) return 'UNWHOLE';
            if (minAfter===0) return '';
            if (endTarget <= minAfter) return '';
            else {
                return 'TOOLATE';
            }
        } else if (order===MAX_ACTIVITY-1){
            // 其起始时间应该比之前任务时间中最大的大
            const startTarget =totalTimes[order*2-2];
            const maxBefore =Math.max(...totalTimes.slice(0,order*2-2));
            if (startTarget===0) return 'UNWHOLE';
            if (maxBefore===0) return '';
            if (startTarget >= maxBefore) return '';
            else {
                return 'TOOEARLY'
            }
        } else{
            const startTarget =totalTimes[order*2-2];
            const endTarget =totalTimes[order*2-1];
            const maxBefore =Math.max(...totalTimes.slice(0,order*2-2));
            const minAfter =Math.min(...totalTimes.slice(order*2,MAX_ACTIVITY*2));
            if (startTarget===0 || endTarget===0) return 'UNWHOLE';
            if (maxBefore===0 && minAfter===0) return ''
            if (maxBefore && minAfter){
               if (startTarget>=maxBefore && endTarget<=minAfter) return ''
               else if (startTarget<maxBefore){
                return 'TOOEARLY'
               }else {
                return 'TOOLATE'
               }      
            }
            if (maxBefore){
                if (startTarget>=maxBefore) return ''
                else {return 'TOOEARLY'}    
            }
            if (minAfter){
                if (endTarget<=minAfter) return ''
                else {return 'TOOLATE'}
            }
        }
    },[])

    return (
        <Form form={form}>
            <Form.Item label='活动一' name={'Activity0'} validateTrigger='onFocus'
                rules={[
                    ({getFieldValue})=>({
                        validator(){
                            // 检测函数
                           const info = checkTime(0,getFieldValue);
                           if (info?.length){
                            return Promise.reject(INFO_MAP[info as keyof typeof INFO_MAP])
                           }
                           return Promise.resolve()
                        }
                    })
                ]}
            >
                <RangePicker showTime={{format:'HH:mm'}}></RangePicker>
            </Form.Item>
            <Form.Item label='活动二' name={'Activity1'} validateTrigger='onFocus'
                 rules={[
                    ({getFieldValue})=>({
                        validator(){
                            // 检测函数
                           const info = checkTime(1,getFieldValue);
                           if (info?.length){
                            return Promise.reject(INFO_MAP[info as keyof typeof INFO_MAP])
                           }
                           return Promise.resolve()
                        }
                    })
                ]}
            >
                <RangePicker showTime={{format:'HH:mm'}}></RangePicker>
            </Form.Item>
            <Form.Item label='活动三' name={'Activity2'} validateTrigger='onFocus'
                 rules={[
                    ({getFieldValue})=>({
                        validator(){
                            // 检测函数
                           const info = checkTime(2,getFieldValue);
                           if (info?.length){
                            return Promise.reject(INFO_MAP[info as keyof typeof INFO_MAP])
                           }
                           return Promise.resolve()
                        }
                    })
                ]}
            >
                <RangePicker showTime={{format:'HH:mm'}}></RangePicker>
            </Form.Item>
            <Form.Item>
                <Button onClick={()=>{
                    form.validateFields().then(result=>{
                        console.log(result);
                    })
                }}>创建活动</Button>
            </Form.Item>
        </Form>
    )
}