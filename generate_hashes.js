const bcrypt = require('bcrypt');

async function generateHashes() {
    const password1 = 'smiths';
    const password2 = 'smiths123ABC$';
    const testPassword = 'Test123!';
    
    const hash1 = await bcrypt.hash(password1, 10);
    const hash2 = await bcrypt.hash(password2, 10);
    const hash3 = await bcrypt.hash(testPassword, 10);
    
    console.log('Password: smiths');
    console.log('Hash:', hash1);
    console.log('');
    console.log('Password: smiths123ABC$');
    console.log('Hash:', hash2);
    console.log('');
    console.log('Password: Test123!');
    console.log('Hash:', hash3);
}

generateHashes();
