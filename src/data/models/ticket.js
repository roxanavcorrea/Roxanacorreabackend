import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true, min: 0 },
    purchaser: { type: String, required: true, match: /.+@.+\..+/ }, 
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;