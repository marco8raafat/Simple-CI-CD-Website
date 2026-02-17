pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "ci-cd-backend"
        FRONTEND_IMAGE = "ci-cd-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning GitHub repository...'
                git branch: 'main', url: 'https://github.com/marco8raafat/Simple-CI-CD-Website.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                echo 'Building backend Docker image...'
                dir('backend') {
                    sh 'docker build -t $BACKEND_IMAGE .'
                }
            }
        }
        stage('Test') {
            steps {
                sh 'cd backend && npm test'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                echo 'Building frontend Docker image...'
                dir('frontend') {
                    sh 'docker build -t $FRONTEND_IMAGE .'
                }
            }
        }

        stage('Run Containers') {
            steps {
                echo 'Running containers...'
                sh '''
                    docker stop backend_container frontend_container || true
                    docker rm backend_container frontend_container || true
                    docker run -d --name backend_container -p 3000:3000 $BACKEND_IMAGE
                    docker run -d --name frontend_container -p 8081:80 $FRONTEND_IMAGE
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished!'
        }
    }
}
