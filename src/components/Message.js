import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Grid2, Typography, List, ListItem, ListItemText, Box} from '@mui/material';
import Axios from "axios";
import StateContext from '../Contexts/StateContext';

function Message() {
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMessages() {
            try {
                const response = await Axios.get(
                    `http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/messages/`
                );
    
                console.log("Fetched messages:", response.data);
    
                // Sort messages by created timestamp (newest first)
                const sortedMessages = response.data.sort(
                    (a, b) => new Date(b.created) - new Date(a.created)
                );
    
                setMessages(sortedMessages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setLoading(false);
            }
        }
    
        fetchMessages();
    }, [GlobalState.userId]);

    if (loading) {
        return (
            <Grid2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Grid2>
        );
    }

    return (
        <Grid2 style={{ width: '50%', margin: 'auto', marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Messages
            </Typography>
            {messages.length === 0 ? (
                <Typography>No messages found.</Typography>
            ) : (
                <List>
                    {messages.map((message, index) => (
                    <ListItem divider key={index}>
                        <Box width="100%">
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="subtitle1" fontWeight="bold" component="span">
                                    {message.message_sender_name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="span">
                                    {new Date(message.created).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="bold" component="div">
                                {message.subject}
                            </Typography>
                            <Typography variant="body2" component="div">
                                {message.body}
                            </Typography>
                        </Box>
                    </ListItem>
                    ))}
                </List>
            )}
        </Grid2>
    );
}

export default Message;
