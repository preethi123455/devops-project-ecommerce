pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code checked out successfully'
            }
        }

        stage('Debug Environment') {
            steps {
                sh 'node -v || echo "Node not installed"'
                sh 'npm -v || echo "npm not installed"'
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'echo "Installing dependencies..."'
                sh 'npm install || echo "npm install failed or skipped"'
            }
        }

        stage('Build') {
            steps {
                sh 'echo "Building project..."'
                sh 'npm run build || echo "build failed or skipped"'
            }
        }
    }
}
