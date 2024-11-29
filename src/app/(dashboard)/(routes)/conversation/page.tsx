'use client'

import Heading from "@/components/heading"
import { MessageSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

import * as z from 'zod';

import { formSchema } from './constant'
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import Loader from '@/components/loader'
import React, { useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';



import MainComponent from "@/components/map"



export default function ConversationPage() {
    const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([])
    console.log(messages, 'messages')
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ''
        }
    })
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionMessageParam = {
                role: 'user',
                content: values.prompt
            }
            const newMessages = [...messages, userMessage]

            const response = await axios.post('http://0.0.0.0:9000/query', {
                query: userMessage.content
            })
            const assistantMessage: ChatCompletionMessageParam = {
                role: 'assistant',
                content: JSON.stringify(response.data.data),
                userPrompt: userMessage.content
            }

            setMessages((current) => [...current, userMessage, assistantMessage])

            form.reset()
        }
        catch (e) {
            // TODO : Open Pro Model
            console.log(e, 'error on api')
        }
        finally {
            router.refresh()
        }
    }

    return (
        <div>
            <Heading
                title='Conversation'
                description='Chat with most intelligent GeoAI'
                icon={MessageSquare}
                iconColor='text-violet-500'
                bgColor='bg-violet-500/10'
            />
            <div className='px-4 lg:px-8'>
                <div>
                    <Form
                        {...form}
                    >
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'
                        >
                            <FormField
                                name='prompt'
                                render={({ field }) => (
                                    <FormItem
                                        className='col-span-12 lg:col-span-10'
                                    >
                                        <FormControl className='m-0 p-0'>
                                            <Input className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent' disabled={isLoading} placeholder='Find the points in the singapore' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {!isLoading ? (<Button className='col-span-12 lg:col-span-2 w-full' disabled={isLoading}>
                                Generate
                            </Button>)
                                : (<div className='p-1 rounded-lg flex items-center justify-center bg-muted'>
                                    <Loader />
                                </div>)
                            }
                        </form>
                    </Form>
                </div>
            </div>
            <div
                style={{
                    height: '75vh',
                    padding: 8,
                    marginLeft: 25,
                    marginRight: 25,
                }}
            >
                <MainComponent messages={messages} setMessages={setMessages} />
            </div>
        </ div>
    )
}     
