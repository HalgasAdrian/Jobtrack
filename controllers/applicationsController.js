import mongodb from "mongodb";

export const createApplication = async (req, res) => {
  const applications = req.db.collection("applications");
  const { company, role, submittedAt, url, notes } = req.body;
  const userId = req.user.id;

  try {
    const newApplication = {
      userId,
      company: company ? company : "unknown",
      role: role ? role : "",
      status: "applied",
      submittedAt: submittedAt ? submittedAt : Date.now(),
      url,
      notes,
      createdAt: Date.now(),
      updateAt: Date.now(),
    };

    const newApp = await applications.insertOne(newApplication);

    res.status(201).json({
      id: newApp.insertedId,
      message: "Application created successfully!",
      ...newApplication,
    });
  } catch (error) {
    console.log("Error creating application: ", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  const applications = req.db.collection("applications");
  const userId = req.user.id;

  try {
    const applicationsList = await applications
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    return res.status(200).json(applicationsList);
  } catch (error) {
    console.log("Error fetching applications: ", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getApplication = async (req, res) => {
  const applications = req.db.collection("applications");
  const userId = req.user.id;
  const applicationId = req.params.id;

  try {
    const application = await applications.findOne({
      _id: new mongodb.ObjectId(applicationId),
      userId,
    });
    if (!application) {
      return res.status(404).json({ message: "Application not found!" });
    }
    return res.status(200).json(application);
  } catch (error) {
    console.log("Error fetching application: ", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateApplication = async (req, res) => {
  const applications = req.db.collection("applications");
  const userId = req.user.id;
  const applicationId = req.params.id;

  const { company, role, submittedAt, url, notes, status } = req.body;
  const updateData = {
    company: company ? company : "unknown",
    role: role ? role : "",
    submittedAt: submittedAt ? submittedAt : Date.now(),
    status: status ? status : "applied",
    url,
    notes,
    updateAt: Date.now(),
  };

  try {
    // update application
    const updatedApplication = await applications.updateOne(
      { _id: new mongodb.ObjectId(applicationId), userId },
      { $set: updateData },
    );
    if (updatedApplication.matchedCount === 0) {
      return res.status(404).json({ message: "Application not found!" });
    }
    return res
      .status(200)
      .json({ message: "Application updated successfully!", ...updateData });
  } catch (error) {
    console.log("Error updating application: ", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  const applications = req.db.collection("applications");
  const userId = req.user.id;
  const applicationId = req.params.id;

  try {
    // delete application
    const deletedApplication = await applications.deleteOne({
      _id: new mongodb.ObjectId(applicationId),
      userId,
    });
    if (deletedApplication.deletedCount === 0) {
      return res.status(404).json({ message: "Application not found!" });
    }
    return res
      .status(200)
      .json({ message: "Application deleted successfully!" });
  } catch (error) {
    console.log("Error deleting application: ", error);
    return res.status(500).json({ message: error.message });
  }
};
