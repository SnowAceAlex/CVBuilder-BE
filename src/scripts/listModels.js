import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function list() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
    );
    const data = await response.json();
    fs.writeFileSync(
      'models.json',
      JSON.stringify(
        data.models.map((m) => m.name),
        null,
        2,
      ),
    );
    console.log('Done');
  } catch (e) {
    console.log(e);
  }
}
list();
