"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react"; // 読み込みアイコン用

const TECH_SKILLS = ["Next.js", "TypeScript", "Terraform", "Python", "SQL", "React", "AWS"];
const BIZ_SKILLS = ["KPI設計", "課題定義", "意思決定支援", "データ分析", "コスト削減"];

// AIからの返信を受け取るための「型（ルール）」を定義
interface AIResult {
  title: string;
  description: string;
  businessGoal: string;
  technicalChallenge: string;
  winningDecision: string;
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedTech, setSelectedTech] = useState<string[]>([]); // [ ] は配列
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null); // { } はオブジェクト

  const toggleTech = (skill: string) => {
    setSelectedTech(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // ★ここが「窓口」を叩く関数！
  const generateProject = async () => {
    setIsLoading(true); // 読み込み開始！
    try {
      // 1. fetchを使ってAPI窓口に「予約注文」を出す
      const response = await fetch("/api/generate", {
        method: "POST", // POSTで送る
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          techSkills: selectedTech,
          bizSkills: ["KPI設計"], // 今回は固定
          interests: ["Fintech"] // 今回は固定
        })
      });

      // 2. 公式封筒（NextResponse）が届くのを待って、中身を取り出す
      const data = await response.json();
      setResult(data); // 届いた { } を保存
      setStep(3); // 結果表示画面へ
    } catch (error) {
      console.error("エラーが発生しました", error);
    } finally {
      setIsLoading(false); // 読み込み終了
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-2xl space-y-4">
        <Progress value={(step / 3) * 100} className="w-full" />
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Skill-Driven Builder</CardTitle>
            <CardDescription>AIがあなたの次なる挑戦を設計します</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Step 1: 技術スタックを選択</h3>
                <div className="flex flex-wrap gap-2">
                  {TECH_SKILLS.map(skill => (
                    <Badge 
                      key={skill}
                      variant={selectedTech.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer text-sm py-1 px-3"
                      onClick={() => toggleTech(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full mt-4" onClick={() => setStep(2)}>次へ</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 text-center py-6">
                <h3 className="text-lg font-medium">プロジェクトを生成しますか？</h3>
                <Button 
                  className="w-full h-12 text-lg" 
                  onClick={generateProject}
                  disabled={isLoading}
                >
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> AIが思考中...</> : "提案を生成する"}
                </Button>
              </div>
            )}

            {step === 3 && result && (
              <div className="space-y-4 animate-in fade-in duration-700">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-xl font-bold text-blue-900">{result.title}</h3>
                  <p className="text-blue-800 mt-2">{result.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white border rounded shadow-sm">
                    <p className="font-bold text-slate-500 underline">ビジネスゴール</p>
                    <p>{result.businessGoal}</p>
                  </div>
                  <div className="p-3 bg-white border rounded shadow-sm">
                    <p className="font-bold text-slate-500 underline">技術的挑戦</p>
                    <p>{result.technicalChallenge}</p>
                  </div>
                </div>
                <Button className="w-full variant-outline" onClick={() => setStep(1)}>最初からやり直す</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}