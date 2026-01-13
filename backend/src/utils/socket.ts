import { Server, Socket } from "socket.io";
import User from "../models/user.model";

// Define interfaces for the event payloads
interface IdentityPayload {
    userId: string;
}

interface LocationPayload {
    latitude: number;
    longitude: number;
    userId: string;
}

export const socketHandler = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Handle Identity (Mapping userId to socketId)
        socket.on('identity', async ({ userId }: IdentityPayload) => {
            try {
                await User.findByIdAndUpdate(userId, {
                    socketId: socket.id,
                    isOnline: true
                }, { new: true });
            } catch (error) {
                console.error("Socket Identity Error:", error);
            }
        });

        // Handle Real-time Location Updates
        socket.on('updateLocation', async ({ latitude, longitude, userId }: LocationPayload) => {
            try {
                const user = await User.findByIdAndUpdate(userId, {
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude] // GeoJSON: [lng, lat]
                    },
                    isOnline: true,
                    socketId: socket.id
                });

                if (user) {
                    // Broadcast location to all connected clients (e.g., tracking screens)
                    io.emit('updateDeliveryLocation', {
                        deliveryBoyId: userId,
                        latitude,
                        longitude
                    });
                }
            } catch (error) {
                console.error('updateDeliveryLocation error:', error);
            }
        });

        // Handle Disconnection
        socket.on('disconnect', async () => {
            try {
                await User.findOneAndUpdate(
                    { socketId: socket.id },
                    {
                        socketId: null,
                        isOnline: false
                    }
                );
                console.log(`User disconnected: ${socket.id}`);
            } catch (error) {
                console.error("Socket Disconnect Error:", error);
            }
        });
    });
};