// import { db } from '../db';
// import { exams } from '../schema/exams';
// import { timeBlocks } from '../schema/time-blocks';
// import { questions } from '../schema/questions';
// import { v4 as uuidv4 } from 'uuid';

// async function seed() {
//   try {
//     console.log('Starting to seed exams data...');

//     // Create sample exams
//     // const examIds = await Promise.all([
//       db.insert(exams).values({
//         id: uuidv4(),
//         title: 'Introduction to JavaScript',
//         description: 'A basic test on JavaScript fundamentals',
//         createdBy: uuidv4(), // Replace with actual admin/user ID
//         duration: 60,
//         availableFrom: new Date('2023-11-01T09:00:00.000Z'),
//         availableTo: new Date('2023-12-31T18:00:00.000Z'),
//         status: 'published',
//         totalQuestions: 5,
//         participants: 0,
//       }).returning({ id: exams.id }),

//       db.insert(exams).values({
//         id: uuidv4(),
//         title: 'Advanced TypeScript',
//         description: 'Test your knowledge of TypeScript advanced concepts',
//         createdBy: uuidv4(), // Replace with actual admin/user ID
//         duration: 90,
//         availableFrom: new Date('2023-12-01T09:00:00.000Z'),
//         availableTo: new Date('2024-01-31T18:00:00.000Z'),
//         status: 'draft',
//         totalQuestions: 0,
//         participants: 0,
//       }).returning({ id: exams.id }),

//       db.insert(exams).values({
//         id: uuidv4(),
//         title: 'Database Design Principles',
//         description: 'Comprehensive exam on database design and normalization',
//         createdBy: uuidv4(), // Replace with actual admin/user ID
//         duration: 120,
//         availableFrom: new Date('2023-10-15T09:00:00.000Z'),
//         availableTo: new Date('2023-10-16T18:00:00.000Z'), // Past date
//         status: 'archived',
//         totalQuestions: 10,
//         participants: 5,
//       }).returning({ id: exams.id }),
//     ]);

//     // Add time blocks for the first exam
//     await db.insert(timeBlocks).values({
//       id: uuidv4(),
//       examId: examIds[0].id,
//       startTime: new Date('2023-11-01T09:00:00.000Z'),
//       endTime: new Date('2023-11-01T10:00:00.000Z'),
//       duration: 60,
//     });

//     // Add questions for the first exam
//     await db.insert(questions).values([
//       {
//         id: uuidv4(),
//         examId: examIds[0].id,
//         text: 'What is the result of 2 + 2 in JavaScript?',
//         type: 'single_choice',
//         options: JSON.stringify([
//           { id: 'a1', text: '3', isCorrect: false },
//           { id: 'a2', text: '4', isCorrect: true },
//           { id: 'a3', text: '5', isCorrect: false },
//           { id: 'a4', text: '22', isCorrect: false },
//         ]),
//         correctAnswer: 'a2',
//         marks: 1,
//       },
//       {
//         id: uuidv4(),
//         examId: examIds[0].id,
//         text: 'Which of the following are valid JavaScript data types?',
//         type: 'multiple_choice',
//         options: JSON.stringify([
//           { id: 'b1', text: 'String', isCorrect: true },
//           { id: 'b2', text: 'Boolean', isCorrect: true },
//           { id: 'b3', text: 'Char', isCorrect: false },
//           { id: 'b4', text: 'Object', isCorrect: true },
//         ]),
//         correctAnswer: 'b1,b2,b4',
//         marks: 2,
//       },
//     ]);

//     console.log('Seed completed successfully!');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//   }
// }

// // Run the seed function if this file is executed directly
// if (require.main === module) {
//   seed()
//     .then(() => process.exit(0))
//     .catch((error) => {
//       console.error(error);
//       process.exit(1);
//     });
// }

// export default seed;
