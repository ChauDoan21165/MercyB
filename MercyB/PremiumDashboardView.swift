/**
 * MercyB: Premium Dashboard (The Pro interaction Hub)
 * Path: MercyB/PremiumDashboardView.swift
 * Strategy: High-fidelity pedagogical command center.
 * Features: Radial Phonics Progress, Active Teacher Status, and S/ED Cluster Challenges.
 * Protocol V4.0: Full Fixed File.
 */

import SwiftUI

// --- Content Models ---
struct SpeakingChallenge: Identifiable {
    let id = UUID()
    let title: String
    let target: String
    let difficulty: String
    let icon: String
}

struct PremiumDashboardView: View {
    // Shared state (In production, these would link to a UserProfile service)
    @State private var phonicsMastery: Double = 0.72 
    @State private var masteredCount: Int = 4
    
    // Mission: S and ED clusters for Vietnamese Learners
    let challenges = [
        SpeakingChallenge(title: "The 'S' Sprint", target: "Final /s/ Clusters", difficulty: "Beginner", icon: "wind"),
        SpeakingChallenge(title: "Past Tense 'ED'", target: "Voiced /d/ vs /t/", difficulty: "Intermediate", icon: "clock.arrow.circlepath"),
        SpeakingChallenge(title: "Complex Clusters", target: "sts / sps / kts", difficulty: "Advanced", icon: "waveform.path.ecg"),
        SpeakingChallenge(title: "Daily Fluency", target: "Mixed Ending Sounds", difficulty: "Intermediate", icon: "mouth.fill")
    ]
    
    @State private var animatedScore: Double = 0.0
    @State private var isTeacherActive = false
    @State private var entranceAnimation = false

    var body: some View {
        NavigationView {
            ZStack {
                Color(.systemGroupedBackground).ignoresSafeArea()
                
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 28) {
                        
                        // MARK: - Teacher Mercy Status Card
                        HStack(spacing: 16) {
                            ZStack {
                                Circle()
                                    .fill(Color.pink.opacity(0.1))
                                    .frame(width: 60, height: 60)
                                Image(systemName: "person.wave.2.fill")
                                    .foregroundColor(.pink)
                                    .font(.title2)
                                
                                // Pulse Indicator
                                Circle()
                                    .stroke(Color.green, lineWidth: 3)
                                    .frame(width: 64, height: 64)
                                    .scaleEffect(isTeacherActive ? 1.1 : 1.0)
                                    .opacity(isTeacherActive ? 0.3 : 1.0)
                            }
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text("TEACHER MERCY")
                                    .font(.system(size: 11, weight: .black))
                                    .foregroundColor(.secondary)
                                    .tracking(1.5)
                                Text("Online & Ready")
                                    .font(.headline)
                                    .foregroundColor(.primary)
                            }
                            Spacer()
                            Image(systemName: "crown.fill")
                                .symbolRenderingMode(.multicolor)
                                .font(.title3)
                        }
                        .padding()
                        .background(RoundedRectangle(cornerRadius: 24).fill(Color(.systemBackground)))
                        .padding(.horizontal)
                        .padding(.top, 20)

                        // MARK: - Radial Phonics Mastery Ring
                        VStack(spacing: 20) {
                            ZStack {
                                // Background Track
                                Circle()
                                    .stroke(lineWidth: 20)
                                    .opacity(0.08)
                                    .foregroundColor(.blue)
                                
                                // Dynamic Progress Ring
                                Circle()
                                    .trim(from: 0.0, to: animatedScore)
                                    .stroke(style: StrokeStyle(lineWidth: 20, lineCap: .round))
                                    .foregroundColor(.blue)
                                    .rotationEffect(Angle(degrees: 270.0))
                                    .shadow(color: .blue.opacity(0.2), radius: 10, x: 0, y: 5)
                                
                                VStack(spacing: -4) {
                                    Text("\(Int(animatedScore * 100))%")
                                        .font(.system(size: 48, weight: .black))
                                    Text("MASTERY")
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundColor(.secondary)
                                }
                            }
                            .frame(width: 220, height: 220)
                            
                            Text("You've unlocked \(masteredCount) Phonics Badges!")
                                .font(.system(size: 14, weight: .bold))
                                .padding(.horizontal, 20)
                                .padding(.vertical, 10)
                                .background(Capsule().fill(Color.blue.opacity(0.1)))
                                .foregroundColor(.blue)
                        }
                        .frame(maxWidth: .infinity)
                        .scaleEffect(entranceAnimation ? 1.0 : 0.9)
                        .opacity(entranceAnimation ? 1.0 : 0.0)

                        // MARK: - Daily Challenges List
                        VStack(alignment: .leading, spacing: 16) {
                            Text("DAILY SPEAKING MISSIONS")
                                .font(.system(size: 12, weight: .black))
                                .foregroundColor(.secondary)
                                .padding(.horizontal)
                                .tracking(1)
                            
                            ForEach(Array(challenges.enumerated()), id: \.element.id) { index, challenge in
                                ChallengeRow(challenge: challenge)
                                    .offset(x: entranceAnimation ? 0 : 40)
                                    .opacity(entranceAnimation ? 1.0 : 0.0)
                                    .animation(.spring(response: 0.5, dampingFraction: 0.7).delay(Double(index) * 0.1), value: entranceAnimation)
                            }
                        }
                        
                        Spacer(minLength: 40)
                    }
                }
            }
            .navigationBarHidden(true)
            .onAppear {
                withAnimation(.easeOut(duration: 1.5)) {
                    animatedScore = phonicsMastery
                    entranceAnimation = true
                }
                withAnimation(.easeInOut(duration: 1.0).repeatForever(autoreverses: true)) {
                    isTeacherActive = true
                }
            }
        }
    }
}

// MARK: - Subview: Challenge Row
struct ChallengeRow: View {
    let challenge: SpeakingChallenge
    
    var body: some View {
        Button(action: {
            // Logic to launch Practice Mode
        }) {
            HStack(spacing: 16) {
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color.blue.opacity(0.08))
                        .frame(width: 56, height: 56)
                    Image(systemName: challenge.icon)
                        .foregroundColor(.blue)
                        .font(.title3)
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(challenge.title)
                        .font(.system(size: 17, weight: .bold))
                        .foregroundColor(.primary)
                    Text(challenge.target)
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    Text(challenge.difficulty)
                        .font(.system(size: 10, weight: .black))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.primary.opacity(0.05))
                        .cornerRadius(6)
                    
                    Image(systemName: "chevron.right")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.blue.opacity(0.4))
                }
            }
            .padding()
            .background(RoundedRectangle(cornerRadius: 24).fill(Color(.systemBackground)))
            .padding(.horizontal)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

#Preview {
    PremiumDashboardView()
}