FROM python:3.11-slim

# Install Python dependencies
RUN pip install pylint

# Install Node.js v20.11.0
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Install Yarn
RUN npm install -g yarn

WORKDIR /linters

# Copy your Node.js application files into the container
COPY . ./

# Install Node.js dependencies
RUN yarn

ENV PORT 4002
EXPOSE $PORT

CMD ["node", "server.js"]