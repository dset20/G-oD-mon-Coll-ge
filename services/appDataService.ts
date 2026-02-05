
import { Exercise, Property, StudentProgress, GradeLevel } from '../types';
import { EXERCISES as MOCK_EXERCISES, PROPERTIES as MOCK_PROPERTIES } from '../constants';

// --- MOCK DATA (will be replaced by DB calls) ---
let currentStudentProgress: StudentProgress = {
  userId: 'user-dset20', // Unique identifier for the user
  completedExercises: ['ex-001', 'ex-002'], // Example completed exercises
  points: 1250, // Example points
  lastGrade: '4ème', // Last grade accessed
};

// Simulate async operations
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class AppDataService {
  /**
   * Loads all available exercises.
   * In a Tauri app, this would involve invoking a Rust command to fetch from SQLite.
   */
  async loadExercises(): Promise<Exercise[]> {
    await simulateDelay();
    // TODO: Replace with Tauri.invoke('get_exercises')
    return MOCK_EXERCISES;
  }

  /**
   * Loads all available properties.
   * In a Tauri app, this would involve invoking a Rust command to fetch from SQLite.
   */
  async loadProperties(): Promise<Property[]> {
    await simulateDelay();
    // TODO: Replace with Tauri.invoke('get_properties')
    return MOCK_PROPERTIES;
  }

  /**
   * Loads the current student's progress.
   * In a Tauri app, this would involve invoking a Rust command to fetch from SQLite based on userId.
   */
  async loadStudentProgress(): Promise<StudentProgress> {
    await simulateDelay();
    // TODO: Replace with Tauri.invoke('get_student_progress', { userId: '...' })
    return { ...currentStudentProgress }; // Return a copy to avoid direct mutation
  }

  /**
   * Saves the current student's progress.
   * In a Tauri app, this would involve invoking a Rust command to update SQLite.
   */
  async saveStudentProgress(progress: StudentProgress): Promise<void> {
    await simulateDelay();
    // TODO: Replace with Tauri.invoke('save_student_progress', { progress: progress })
    currentStudentProgress = { ...progress };
    console.log('Student progress saved:', currentStudentProgress);
  }

  /**
   * Marks an exercise as completed and updates points.
   * This combines loading, updating, and saving progress.
   */
  async completeExercise(exerciseId: string, pointsAwarded: number): Promise<StudentProgress> {
    await simulateDelay();
    let progress = await this.loadStudentProgress();
    
    if (!progress.completedExercises.includes(exerciseId)) {
      progress.completedExercises.push(exerciseId);
      progress.points += pointsAwarded;
      await this.saveStudentProgress(progress);
    }
    return progress;
  }

  /**
   * Gets a single exercise by ID.
   * In a Tauri app, this would involve invoking a Rust command.
   */
  async getExerciseById(exerciseId: string): Promise<Exercise | undefined> {
    await simulateDelay();
    // TODO: Replace with Tauri.invoke('get_exercise_by_id', { id: exerciseId })
    return MOCK_EXERCISES.find(ex => ex.id === exerciseId);
  }
  
  /**
   * Updates the last grade accessed by the student.
   */
  async updateLastGrade(grade: GradeLevel): Promise<StudentProgress> {
    await simulateDelay();
    let progress = await this.loadStudentProgress();
    progress.lastGrade = grade;
    await this.saveStudentProgress(progress);
    return progress;
  }
}

export const appDataService = new AppDataService();

// Example of how to integrate with Tauri (conceptual for this file)
// declare global {
//   interface Window {
//     __TAURI__?: {
//       invoke: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>;
//     };
//   }
// }
//
// const invokeTauri = window.__TAURI__?.invoke || ((cmd: string, args?: Record<string, unknown>) => {
//   console.warn(`Tauri command "${cmd}" not available. Using mock data.`, args);
//   return Promise.resolve(null); // Or throw an error, depending on desired mock behavior
// });
    