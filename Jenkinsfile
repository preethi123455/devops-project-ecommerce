pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "cartify-app"
        // Branch-specific variables initialized in stages
        PORT = ""
        CONTAINER_NAME = ""
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Building branch: ${env.BRANCH_NAME}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Project') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${env.BRANCH_NAME} ."
            }
        }

        stage('Deploy') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        PORT = "3000"
                        CONTAINER_NAME = "cartify-prod"
                    } else if (env.BRANCH_NAME == 'admin') {
                        PORT = "3001"
                        CONTAINER_NAME = "cartify-staging"
                    } else {
                        echo "Skipping deployment for branch: ${env.BRANCH_NAME}"
                        return
                    }

                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    sh "docker run -d --name ${CONTAINER_NAME} -p ${PORT}:3000 ${DOCKER_IMAGE}:${env.BRANCH_NAME}"
                    echo "Deployed ${env.BRANCH_NAME} to port ${PORT}"
                }
            }
        }
    }
}
