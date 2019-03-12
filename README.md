# Pageview

NodeJS application, which shows the number of pageviews for the past 1 minute (window of last 60 seconds)

Pls try out the latest versions of Gitlab as they offer a complete stack that includes project management, version control, and CI/CD on Kubernetes (see Auto Devops)

## Before start

Before getting started, you should setup the following accounts

- Github
- CircleCI
- Google Cloud Platform

## Setting up Google Kubernetes Engine

- Login to your Google Cloud Console
- Visit the Kubernetes Engine page and click ‘Create Cluster’
- Create a Service Account (https://console.cloud.google.com/iam-admin/serviceaccounts)
- Service account roles should be
  - Kubernetes > Kubernetes Engine Developer
  - Storage > Storage Admin
- Create new private key in JSON

## Setting up CircleCI

- Link your github repo to project
- Open project settings
- Navigate to the Environment Variables page
- Open that JSON file and copy the contents to the clipboard.
- Create an environment variable called GCLOUD_SERVICE_KEY and paste in the contents of that JSON
- Set up next env variables (copy from GKE prject settings and cluster settings)
  - PROJECT_NAME: "pageview"
  - GOOGLE_PROJECT_ID: "pageview"
  - GOOGLE_COMPUTE_ZONE: "europe-west1-b"
  - GOOGLE_CLUSTER_NAME: "cluster-1"
