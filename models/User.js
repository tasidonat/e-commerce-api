const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    address: {
        type: String,
    }
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign(
        { _id: this._id, role: this.role, email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;