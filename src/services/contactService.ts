import { supabase } from '../lib/supabase'

export interface ContactMessageData {
  name: string
  email: string
  subject: string
  message: string
}

export const submitContactMessage = async (data: ContactMessageData) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-contact-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to submit contact message')
  }

  return response.json()
}

export const getContactMessages = async () => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}