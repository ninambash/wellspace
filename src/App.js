import React, { useEffect, useState } from 'react';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import styled from 'styled-components';

const primaryColor = "#3498db";
const secondaryColor = "#2c3e50";

const AppContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 30px;
  text-align: center;
  background-color: ${secondaryColor};
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  background-color: #ffffff;
  padding: 30px;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  font-size: 1.2rem;
  color: #333;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const Button = styled.button`
  background-color: ${primaryColor};
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

function App() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  useEffect(() => {
    // You can perform any initialization logic here
  }, []);

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
      },
    });
    if (error) {
      console.error('Error logging in to Google provider with Supabase', error);
      alert('Error logging in to Google provider with Supabase');
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createCalendarEvent() {
    console.log("Creating calendar event");
    const event = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': start.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': end.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }

    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer ' + session.provider_token
        },
        body: JSON.stringify(event),
      });

      const data = await response.json();
      console.log(data);
      alert("Event created, check your Google Calendar!");
    } catch (error) {
      console.error('Error creating calendar event:', error);
    }
  }

  return (
    <AppContainer>
      {session ? (
        <>
          <h2>Hey there {session.user.email}</h2>
          <FormContainer>
            <Label>Start of your event</Label>
            <DateTimePicker onChange={setStart} value={start} />
            <Label>End of your event</Label>
            <DateTimePicker onChange={setEnd} value={end} />
            <Label>Event name</Label>
            <Input type="text" onChange={(e) => setEventName(e.target.value)} />
            <Label>Event description</Label>
            <Input type="text" onChange={(e) => setEventDescription(e.target.value)} />
          </FormContainer>
          <hr />
          <Button onClick={createCalendarEvent}>Create Calendar Event</Button>
          <p></p>
          <Button onClick={signOut}>Sign Out</Button>
        </>
      ) : (
        <Button onClick={googleSignIn}>Sign In With Google</Button>
      )}
    </AppContainer>
  );
}

export default App;
