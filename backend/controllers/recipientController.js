import Recipient from '../models/Recipient.js';

export const getRecipients = async (req, res) => {
  try {
    const contacts = await Recipient.find({ user: req.user.id });
    res.json(contacts);
  } catch (err) { res.status(500).send('Server Error'); }
};

export const addRecipient = async (req, res) => {
  try {
    const newContact = new Recipient({ ...req.body, user: req.user.id });
    await newContact.save();
    res.json(newContact);
  } catch (err) { res.status(500).send('Server Error'); }
};

export const deleteRecipient = async (req, res) => {
  try {
    await Recipient.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Contact removed' });
  } catch (err) { res.status(500).send('Server Error'); }
};