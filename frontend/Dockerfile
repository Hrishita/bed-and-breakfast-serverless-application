FROM node:alpine
WORKDIR /frontend
ENV PATH /frontend/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install --force
COPY . ./
CMD ["npm", "start"]

# docker build -t frontend .
# docker image ls
# docker run -d -p 3000:3000 frontend

# gcloud auth configure-docker us-east1-docker.pkg.dev
# docker tag frontend us-east1-docker.pkg.dev/csci-5410-frontend/frontend/frontend
# docker push us-east1-docker.pkg.dev/csci-5410-frontend/frontend/frontend:latest