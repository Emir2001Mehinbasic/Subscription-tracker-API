import dayjs from "dayjs";
import {createRequire} from "module";
import Subscription from "../models/subscription.model.js";

const require = createRequire(import.meta.url);

const {serve} = require("@upstash/workflow/express");



const REMINDERS = [7,5,2,1];

export const sendReminders = serve( async (context) => {
    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active')return;

    const renewalDate = dayjs(subscription.renewalDate);
    if(renewalDate.isBefore(dayjs())){
        console.log(`Subscription ${subscriptionId} has expired. Stopping workflow`)
        return;
    }
     for(const daysBefore of REMINDERS ){
        const reminderDate = renewalDate.subtract(daysBefore,'day');
        if(reminderDate.isAfter(dayjs())){
            await sleepUntilReminder(context,`Reminder ${daysBefore}-day`,reminderDate);
        }
        await triggerReminder(context,`Reminder ${daysBefore} daysBefore`);
     }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription',async ()=>{
        return Subscription.findById(subscriptionId).populate('user','name email');
    });
}

const sleepUntilReminder = async (context,label,date) => {
    console.log(`Sleeping until ${label} reminder date: ${date}`);
    await context.sleepUntil(label, date.toDate());
    
}
const triggerReminder = async (context,label) => {
    return await context.run('send reminder',()=>{
        console.log(`Triggering ${label} reminder`);
       
    });
}