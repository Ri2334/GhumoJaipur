// Controller = Business logic layer
// It handles the request processing and sends response

// GET handler - retrieve test data
export const getTestData = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test API GET route working!",
    data: {
      places: ["City Palace", "Hawa Mahal", "Albert Hall Museum"],
      timestamp: new Date().toISOString()
    }
  });
};

// POST handler - create test data
export const postTestData = (req, res) => {
  const { name } = req.body;
  
  // Basic validation
  if (!name) {
    return res.status(400).json({
      success: false,
      error: "Name is required"
    });
  }

  res.status(201).json({
    success: true,
    message: "Test data received successfully",
    data: {
      name: name,
      timestamp: new Date().toISOString()
    }
  });
};
