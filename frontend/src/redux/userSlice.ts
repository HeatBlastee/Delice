import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Item, Shop, User } from "../pages/schema";

export interface CartItem extends Item {
    quantity: number;
}

interface ShopOrder {
    shop: {
        _id: string;
        [key: string]: unknown;
    };
    status: string;
    [key: string]: unknown;
}

interface Order {
    _id: string;
    shopOrders: ShopOrder[];
    [key: string]: unknown;
}

interface SocketType {
    emit: (event: string, ...args: unknown[]) => void;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    off: (event: string) => void;
    [key: string]: unknown;
}

interface UserSliceState {
    userData: User | null;
    currentCity: string | null;
    currentState: string | null;
    currentAddress: string | null;
    shopInMyCity: Shop[] | null;
    itemsInMyCity: Item[] | null;
    cartItems: CartItem[];
    totalAmount: number;
    myOrders: Order[];
    searchItems: Item[] | null;
    socket: SocketType | null;
}

const initialState: UserSliceState = {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    cartItems: [],
    totalAmount: 0,
    myOrders: [],
    searchItems: null,
    socket: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<User | null>) => {
            state.userData = action.payload
        },
        setCurrentCity: (state, action: PayloadAction<string | null>) => {
            state.currentCity = action.payload
        },
        setCurrentState: (state, action: PayloadAction<string | null>) => {
            state.currentState = action.payload
        },
        setCurrentAddress: (state, action: PayloadAction<string | null>) => {
            state.currentAddress = action.payload
        },
        setShopsInMyCity: (state, action: PayloadAction<Shop[] | null>) => {
            state.shopInMyCity = action.payload
        },
        setItemsInMyCity: (state, action: PayloadAction<Item[] | null>) => {
            state.itemsInMyCity = action.payload
        },
        setSocket: (state, action: PayloadAction<SocketType | null>) => {
            state.socket = action.payload
        },
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const cartItem = action.payload
            const existingItem = state.cartItems.find(i => i._id == cartItem._id)
            if (existingItem) {
                existingItem.quantity += cartItem.quantity
            } else {
                state.cartItems.push(cartItem)
            }

            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

        },

        setTotalAmount: (state, action: PayloadAction<number>) => {
            state.totalAmount = action.payload
        },

        updateQuantity: (state, action: PayloadAction<{ _id: string | number; quantity: number }>) => {
            const { _id, quantity } = action.payload
            const item = state.cartItems.find(i => i._id == _id)
            if (item) {
                item.quantity = quantity
            }
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        },

        removeCartItem: (state, action: PayloadAction<string | number>) => {
            state.cartItems = state.cartItems.filter(i => i._id !== action.payload)
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        },

        setMyOrders: (state, action: PayloadAction<Order[]>) => {
            state.myOrders = action.payload
        },
        addMyOrder: (state, action: PayloadAction<Order>) => {
            state.myOrders = [action.payload, ...state.myOrders]
        },

        updateOrderStatus: (state, action: PayloadAction<{ orderId: string; shopId: string; status: string }>) => {
            const { orderId, shopId, status } = action.payload
            const order = state.myOrders.find(o => o._id == orderId)
            if (order && order.shopOrders) {
                const shopOrder = order.shopOrders.find((so: ShopOrder) => so.shop._id == shopId)
                if (shopOrder) {
                    shopOrder.status = status
                }
            }
        },

        updateRealtimeOrderStatus: (state, action: PayloadAction<{ orderId: string; shopId: string; status: string }>) => {
            const { orderId, shopId, status } = action.payload
            const order = state.myOrders.find(o => o._id == orderId)
            if (order) {
                const shopOrder = order.shopOrders.find((so: ShopOrder) => so.shop._id == shopId)
                if (shopOrder) {
                    shopOrder.status = status
                }
            }
        },

        setSearchItems: (state, action: PayloadAction<Item[] | null>) => {
            state.searchItems = action.payload
        }
    }
})

export const { setUserData, setCurrentAddress, setCurrentCity, setCurrentState, setShopsInMyCity, setItemsInMyCity, addToCart, updateQuantity, removeCartItem, setMyOrders, addMyOrder, updateOrderStatus, setSearchItems, setTotalAmount, setSocket, updateRealtimeOrderStatus } = userSlice.actions
export default userSlice.reducer
