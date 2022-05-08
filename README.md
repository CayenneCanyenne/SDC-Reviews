# System Design Capstone
The of goal of this project is to replace the existing API with a back end system that can support the full data set for the project and can scale to meet the demands of production traffic.

# Objectives
- Design and multiple database options to analyze and compare, selecting one database option
- Transform the existing application data and load it into the database
- Design and build an API server to provide data to the client in the format specified by the API documentation
- Optimize individual service by analyzing query times and server responses
- Deploy the service, measure and improve the performance of the service at scale

# Tech Specs
- Express
- Node.js
- PostgreSQL
- PGadmin4
- AWS EC2
- NGINX
- node-cache
- Loader.io
- Frisby

# Process
- Designed ETL process and import data from CSV files into PostgreSQL database
- Defined and created database queries, as well as B-tree & Hash indexes
- Uploaded database to the AWS EC2, and created servers that able to interact with the database
- Stress Tested by loader.io
- Optimized performance with Nginx the load balancer and Node Cache

### Query
![Query](https://drive.google.com/uc?export=view&id=1SbaFOpcoCOBrsYqtKVhrfLVvMOvVsuiB)

### Stystem Architecture
![System](https://drive.google.com/uc?export=view&id=1uJjkk-rIQKrP_vuepvcv5ic1tizA9Cw2)

# Outcome

### 2000RPS 30S reviews with product id random 1 - 40k
![2000](https://drive.google.com/uc?export=view&id=1fTZ0oj471_hb_DcFdNghnuc7mYTYy2aG)

### 2500RPS 30S reviews with product id random 1 - 40k
![2500](https://drive.google.com/uc?export=view&id=1zm3vaRoayQWgd50x4g934tDaHVIJROK5)


