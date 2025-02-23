import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Grid, Typography, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Axios from "axios";
import StateContext from '../Contexts/StateContext';

function MessageList() {
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

    // Function to handle message deletion
    async function handleDelete(messageId) {
        const confirmDelete = window.confirm("Are you sure you want to delete this message?");
        if (!confirmDelete) return;

        try {
            await Axios.delete(`http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/messages/${messageId}/`);

            setMessages((prevMessages) => {
                const updatedMessages = prevMessages.filter((message) => message.id !== messageId);
                console.log("Updated messages after delete:", updatedMessages); // Logging the updated messages
                return updatedMessages;
            });
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    }

    if (loading) {
        return (
            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Grid>
        );
    }

    return (
        <Grid style={{ width: '50%', margin: 'auto', marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Messages
            </Typography>
            {messages.length === 0 ? (
                <Typography>No messages found.</Typography>
            ) : (
                <List>
                    {messages.map((message) => (
                        <ListItem divider key={message.id} secondaryAction={
                            <IconButton edge="end" onClick={() => handleDelete(message.id)} aria-label="delete">
                                <DeleteIcon color="error" />
                            </IconButton>
                        }>
                            <Box width="100%">
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {message.message_sender_name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {new Date(message.created).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" fontWeight="bold">
                                    {message.subject}
                                </Typography>
                                <Typography variant="body2">
                                    {message.body}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}
        </Grid>
    );
}

export default MessageList;
