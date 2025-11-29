import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, session } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Authentication helper function
async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401, userId: null };
  }
  
  const token = authHeader.substring(7);
  
  try {
    const sessions = await db.select().from(session).where(eq(session.token, token)).limit(1);
    if (sessions.length === 0) {
      return { error: 'Invalid session', status: 401, userId: null };
    }
    
    const userSession = sessions[0];
    
    if (new Date(userSession.expiresAt) < new Date()) {
      return { error: 'Session expired', status: 401, userId: null };
    }
    
    return { error: null, status: 200, userId: userSession.userId };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Internal server error: ' + error, status: 500, userId: null };
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth.error || !auth.userId) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    
    const users = await db.select()
      .from(user)
      .where(eq(user.id, auth.userId))
      .limit(1);
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(users[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth.error || !auth.userId) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    
    const body = await request.json();
    
    // Define allowed profile fields
    const allowedFields = [
      'bio', 'phone', 'location', 'linkedinUrl', 'githubUrl', 
      'portfolioUrl', 'skills', 'interests', 'achievements', 
      'projects', 'careerGoals', 'mentorshipPreferences', 'name',
      'registrationNumber', 'university', 'enrollmentYear',
      'aadhaarNumber', 'graduationYear', 'currentCompany',
      'currentPosition', 'institutionId', 'institutionName',
      'accreditationStatus', 'departmentId', 'departmentName',
      'accessLevel', 'image', 'role'
    ];
    
    // Define protected fields that cannot be updated
    const protectedFields = ['id', 'email', 'createdAt', 'emailVerified'];
    
    // Check for protected field updates
    const providedFields = Object.keys(body);
    const protectedFieldsAttempted = providedFields.filter(field => 
      protectedFields.includes(field)
    );
    
    if (protectedFieldsAttempted.length > 0) {
      return NextResponse.json({ 
        error: `Cannot update protected fields: ${protectedFieldsAttempted.join(', ')}`,
        code: 'PROTECTED_FIELDS_UPDATE_ATTEMPTED'
      }, { status: 400 });
    }
    
    // Filter to only allowed fields
    const updates: Record<string, any> = {};
    
    for (const field of providedFields) {
      if (allowedFields.includes(field)) {
        let value = body[field];
        
        // JSON field validation
        const jsonFields = ['skills', 'interests', 'achievements', 'projects', 'mentorshipPreferences'];
        if (jsonFields.includes(field)) {
          if (value !== null && value !== undefined) {
            // Validate it's a valid object/array
            if (typeof value !== 'object') {
              return NextResponse.json({ 
                error: `Field '${field}' must be a valid JSON object or array`,
                code: 'INVALID_JSON_FIELD'
              }, { status: 400 });
            }
          }
        }
        
        // Trim string values
        if (typeof value === 'string') {
          value = value.trim();
        }
        
        updates[field] = value;
      }
    }
    
    // Check if there are any valid fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: 'No valid fields provided for update',
        code: 'NO_VALID_FIELDS'
      }, { status: 400 });
    }
    
    // Always update updatedAt timestamp
    updates.updatedAt = new Date();
    
    // Check if user exists
    const existingUsers = await db.select()
      .from(user)
      .where(eq(user.id, auth.userId))
      .limit(1);
    
    if (existingUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Update user profile
    const updatedUsers = await db.update(user)
      .set(updates)
      .where(eq(user.id, auth.userId))
      .returning();
    
    if (updatedUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedUsers[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}