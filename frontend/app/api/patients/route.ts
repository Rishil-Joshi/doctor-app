import { NextRequest, NextResponse } from 'next/server';

// Mock data
let patients = [
  { id: 1, name: 'John Doe', details: 'Patient details', photos: [], videos: [] },
];

export async function GET() {
  return NextResponse.json(patients);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newPatient = { id: patients.length + 1, ...body };
  patients.push(newPatient);
  return NextResponse.json(newPatient, { status: 201 });
}