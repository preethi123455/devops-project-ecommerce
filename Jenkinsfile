pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
    }
}
