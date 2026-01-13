import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // Prismaを呼び出す

// Prisma 接続設定（Prisma のランタイムに明示的に URL を渡す）
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { techSkills, bizSkills, interests } = body;

    const mockResponse = {
      title: `${techSkills[0] || "技術"}を活用した${interests[0] || "新規"}プロダクト`,
      description: `現在の${techSkills.join(", ")}のスキルを活かしつつ...`,
      businessGoal: "KPIを10%改善する。",
      technicalChallenge: "Prismaによるデータ構造の最適化。",
      winningDecision: "MVPを何にするか決めること。"
    };

    // ★ここが新登場！データベースに保存する命令
    await prisma.userProfile.create({
      data: {
        techSkills: techSkills,
        bizSkills: bizSkills,
        interests: interests,
        experience: "初学者", // 今回は仮
        projects: {
          create: {
            title: mockResponse.title,
            description: mockResponse.description,
            businessGoal: mockResponse.businessGoal,
            technicalChallenge: mockResponse.technicalChallenge,
            winningDecision: mockResponse.winningDecision,
          }
        }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error("DB保存エラー:", error);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }
}