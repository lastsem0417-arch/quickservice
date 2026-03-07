require("dotenv").config();

const mongoose = require("mongoose");
const Service = require("./models/Service");

// CONNECT DATABASE
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once("open", async () => {

  console.log("✅ MongoDB Connected for Seeding");

  const description =
  "Professional home service provided by trained experts using modern tools and high quality materials for best results and customer satisfaction.";

  const services = [

  /* CLEANING */

  { name:"Home Deep Cleaning", category:"Cleaning", price:1200 },
  { name:"Bathroom Cleaning", category:"Cleaning", price:400 },
  { name:"Kitchen Cleaning", category:"Cleaning", price:600 },
  { name:"Sofa Cleaning", category:"Cleaning", price:700 },

  /* PLUMBING */

  { name:"Tap Repair", category:"Plumbing", price:200 },
  { name:"Pipe Leak Repair", category:"Plumbing", price:400 },
  { name:"Bathroom Pipe Installation", category:"Plumbing", price:900 },
  { name:"Water Tank Cleaning", category:"Plumbing", price:800 },

  /* ELECTRICAL */

  { name:"Fan Installation", category:"Electrical", price:250 },
  { name:"Switch Board Repair", category:"Electrical", price:200 },
  { name:"Tube Light Installation", category:"Electrical", price:150 },
  { name:"Wiring Repair", category:"Electrical", price:700 },

  /* CARPENTRY */

  { name:"Furniture Repair", category:"Carpentry", price:600 },
  { name:"Door Repair", category:"Carpentry", price:350 },
  { name:"Custom Shelf Installation", category:"Carpentry", price:900 },
  { name:"Table Assembly", category:"Carpentry", price:400 },

  /* PAINTING */

  { name:"Room Painting", category:"Painting", price:2500 },
  { name:"Wall Touchup", category:"Painting", price:800 },
  { name:"Ceiling Painting", category:"Painting", price:1200 },
  { name:"Exterior Painting", category:"Painting", price:6000 },

  /* GARDENING */

  { name:"Garden Cleaning", category:"Gardening", price:700 },
  { name:"Plant Installation", category:"Gardening", price:500 },
  { name:"Lawn Mowing", category:"Gardening", price:600 },
  { name:"Garden Maintenance", category:"Gardening", price:1500 },

  /* AC */

  { name:"AC Service", category:"AC Repair", price:500 },
  { name:"AC Gas Refill", category:"AC Repair", price:1800 },
  { name:"AC Installation", category:"AC Repair", price:1500 },
  { name:"AC Repair", category:"AC Repair", price:700 },

  /* APPLIANCE */

  { name:"Washing Machine Repair", category:"Appliance Repair", price:600 },
  { name:"Refrigerator Repair", category:"Appliance Repair", price:900 },
  { name:"Microwave Repair", category:"Appliance Repair", price:500 },
  { name:"TV Repair", category:"Appliance Repair", price:800 },

  /* BEAUTY */

  { name:"Bridal Makeup", category:"Beauty", price:5000 },
  { name:"Hair Styling", category:"Beauty", price:800 },
  { name:"Facial Treatment", category:"Beauty", price:1200 },
  { name:"Manicure Pedicure", category:"Beauty", price:900 },

  /* TUTORING */

  { name:"Math Tuition", category:"Tutoring", price:400 },
  { name:"English Tuition", category:"Tutoring", price:350 },
  { name:"Science Tuition", category:"Tutoring", price:450 },
  { name:"Programming Basics", category:"Tutoring", price:800 }

  ];

  const finalServices = services.map(service => ({
    name: service.name,
    description: description,
    category: service.category,
    price: service.price,
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviewCount: Math.floor(Math.random() * 200),
    estimatedDuration: 60,
    serviceArea: ["Ahmedabad","Surat","Vadodara"],
    image:"https://picsum.photos/400/300",
    isActive:true
  }));

  // CLEAR OLD DATA
  await Service.deleteMany({});

  // INSERT NEW DATA
  await Service.insertMany(finalServices);

  console.log("🔥 40 Services Seeded Successfully");

  mongoose.connection.close();

});