## NexusFlow - Week 1 Write-Up

During the first week of my NexusFlow project, I focused on setting up the base structure for both the backend and frontend. The main aim of this week was to understand how IoT telemetry data can be received and stored efficiently, while also creating the initial visual canvas where users will later build their automation rules.

NexusFlow is a visual IoT telemetry and rule engine. The idea is to allow a user, such as a factory manager, to create a workflow without writing code. For example, the user should be able to connect a turbine sensor to a filter node and then connect it to an alert node. When the sensor value crosses a defined limit, the system should be able to trigger an alert. In Week 1, I concentrated on creating the foundation required for this flow.

On the backend side, I started by planning the MongoDB database structure for storing sensor telemetry. Since sensor data is generated continuously and can become very large over time, I studied MongoDB Time-Series collections. These collections are suitable for IoT data because they are designed to store timestamp-based records efficiently.

For the telemetry structure, I planned to store fields such as device ID, device type, location, timestamp, temperature, vibration level, pressure, and status. I kept information like device ID and device type as metadata because it will help in grouping and filtering data later. The actual changing values, such as temperature and vibration, will be stored as measurement fields. This structure will make it easier to query the data of a specific device over a selected time range.

I also initialized the Node.js and Express backend project. I organized the project into separate folders for routes, controllers, models, and configuration so that the project remains clean as more features are added. I connected the backend with MongoDB and created the basic setup required for handling API requests.

The main API planned for this module is the telemetry ingestion API. Its purpose is to receive sensor data from a simulated hardware device and save it to the database. For example, a sensor can send a JSON object containing its ID, timestamp, temperature, and vibration values. Before saving the data, the backend should validate that the required fields are available and that the values are in the expected format.

I also considered how the ingestion API can handle frequent incoming data in the future. Instead of designing it only for a single request at a time, I kept the API structure suitable for accepting multiple telemetry records. This will be useful later when I test the system with a larger number of sensor readings. At this stage, my main focus was on building a correct and organized base rather than claiming high performance before proper testing.

On the frontend side, I initialized the React application and started integrating React Flow. React Flow is useful for NexusFlow because it provides a visual, node-based interface. Users will eventually be able to drag components onto a canvas and connect them using edges.

I created the initial canvas layout and added basic placeholder nodes. These include a sensor node, a processing or filter node, and an alert node. The sensor node represents a data source such as a turbine temperature sensor. The filter node will later be used for operations such as moving average calculation or checking whether a value is above a threshold. The alert node represents an action, such as sending an SMS or displaying a warning.

I also worked on understanding how React Flow stores nodes and edges in JSON format. This is important because the workflow created by the user on the frontend will later be sent to the backend. The backend rule engine will read this JSON graph and convert it into an executable data stream using Node.js and RxJS.

One challenge during this week was understanding the difference between normal MongoDB collections and time-series collections. I learned that time-series data needs proper timestamp handling and metadata design from the beginning. Another learning point was React Flow, especially how nodes, handles, and edges are connected. Initially, the canvas setup looked simple, but I understood that it will become the main user interface of the project, so its design needs to be clean and scalable.

By the end of Week 1, I had a clear architecture for NexusFlow. The backend foundation was planned around Express, MongoDB, and telemetry ingestion, while the frontend foundation was created using React and React Flow. The visual canvas is ready to be expanded with custom nodes, and the database design is ready for storing IoT telemetry data.

In the next week, I will focus on creating custom node components and beginning the rule compiler logic. The goal will be to take the workflow JSON created in React Flow and start converting it into executable backend logic.