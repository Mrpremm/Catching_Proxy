require('dotenv').config();


const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
  console.log(`Catching Proxy Server running on port ${PORT}`);
  
})
