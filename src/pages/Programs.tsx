import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Terminal,
  Network,
  BookOpen,
  Layers,
  Server,
  GitBranch,
  Code,
  Cpu,
  Radio,
  Zap,
  Activity,
  CircuitBoard,
  Search,
  CheckCircle2,
  ArrowRight,
  X,
  Mail,
  Phone,
  User,
  Building,
  Send,
  SlidersHorizontal,
  Check,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export interface CourseProgram {
  id: string;
  title: string;
  category: 'AI & Machine Learning' | 'Software & Full Stack' | 'Embedded & Electronics';
  badge: string;
  icon: typeof Brain;
  gradient: string;
  badgeStyle: string;
  borderHover: string;
  summary: string;
  description: string;
  highlights: string[];
  modules: { title: string; topics: string[] }[];
  targetAudience: string;
  prerequisites: string;
  outcomes: string[];
}

export const STATIC_PROGRAMS: CourseProgram[] = [
  // --- 1. AI & Machine Learning Track ---
  {
    id: 'ai-machine-learning',
    title: 'Artificial Intelligence & Machine Learning',
    category: 'AI & Machine Learning',
    badge: 'Flagship AI',
    icon: Brain,
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
    borderHover: 'hover:border-purple-400 hover:shadow-purple-500/10',
    summary: 'Master statistical machine learning, deep neural networks, and model deployment architectures.',
    description: 'A comprehensive journey through fundamental statistics, supervised and unsupervised learning algorithms, deep learning backpropagation, convolutional networks, and end-to-end model serving.',
    highlights: ['Python & Scikit-Learn', 'Deep Neural Networks', 'PyTorch Framework', 'Production Deployment'],
    modules: [
      {
        title: 'Module 1: Foundations of Machine Learning',
        topics: ['Statistical Learning Theory', 'Linear & Logistic Regression', 'Decision Trees & Ensembles', 'Model Evaluation & Cross-Validation']
      },
      {
        title: 'Module 2: Deep Learning & Neural Networks',
        topics: ['Multilayer Perceptrons & Backpropagation', 'Activation Functions & Optimizers (Adam, SGD)', 'Convolutional Neural Networks (CNNs)', 'Regularization & Dropout']
      },
      {
        title: 'Module 3: Sequence Models & Modern AI',
        topics: ['Recurrent Networks (RNN & LSTM)', 'Attention Mechanisms', 'Hyperparameter Optimization', 'Transfer Learning']
      },
      {
        title: 'Module 4: MLOps & Production Inference',
        topics: ['FastAPI Model Endpoints', 'Containerization with Docker', 'Model Monitoring & Drift Detection', 'Real-world Capstone Deployment']
      }
    ],
    targetAudience: 'Aspiring AI Engineers, Data Scientists, and Developers transitioning into Machine Learning.',
    prerequisites: 'Basic Python programming and foundational high school mathematics.',
    outcomes: ['Build and train modern ML & DL models', 'Deploy scalable inference endpoints', 'Industry-ready project portfolio']
  },
  {
    id: 'generative-ai',
    title: 'Generative AI',
    category: 'AI & Machine Learning',
    badge: 'Cutting Edge',
    icon: Sparkles,
    gradient: 'from-fuchsia-600 via-pink-600 to-rose-600',
    badgeStyle: 'bg-pink-50 text-pink-700 border-pink-200',
    borderHover: 'hover:border-pink-400 hover:shadow-pink-500/10',
    summary: 'Explore cutting-edge foundation models, diffusion techniques, and multimodal generation systems.',
    description: 'Learn the architectural foundations and practical applications of modern generative AI, including latent diffusion models, generative adversarial networks (GANs), and enterprise generative pipelines.',
    highlights: ['Diffusion Models', 'Transformers Architecture', 'Multimodal GenAI', 'Fine-Tuning Pipelines'],
    modules: [
      {
        title: 'Module 1: Foundations of Generative Architectures',
        topics: ['Variational Autoencoders (VAEs)', 'Generative Adversarial Networks (GANs)', 'Latent Space Exploration', 'Probability & Sampling Fundamentals']
      },
      {
        title: 'Module 2: The Modern Transformer Paradigm',
        topics: ['Self-Attention & Cross-Attention', 'Encoder-Decoder vs Decoder-Only Models', 'Pre-training at Scale', 'Context Windows & Tokenization']
      },
      {
        title: 'Module 3: Diffusion & Image Synthesis',
        topics: ['Denoising Diffusion Probabilistic Models (DDPM)', 'Latent Diffusion Models & Stable Diffusion', 'Classifier-Free Guidance', 'ControlNet & LoRA Weights']
      },
      {
        title: 'Module 4: Enterprise Applications & Multimodal GenAI',
        topics: ['Vision-Language Models (VLMs)', 'Audio & Speech Synthesis', 'API Orchestration & Guardrails', 'Deploying Custom GenAI Workflows']
      }
    ],
    targetAudience: 'Software developers, creative technologists, and engineers building next-gen AI tools.',
    prerequisites: 'Python knowledge and core understanding of machine learning concepts.',
    outcomes: ['Develop bespoke generative solutions', 'Fine-tune open-weights models', 'Integrate multimodal APIs safely']
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    category: 'AI & Machine Learning',
    badge: 'Applied AI',
    icon: Terminal,
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    badgeStyle: 'bg-orange-50 text-orange-700 border-orange-200',
    borderHover: 'hover:border-orange-400 hover:shadow-orange-500/10',
    summary: 'Systematic frameworks for eliciting deterministic, safe, and structured outputs from LLMs.',
    description: 'Go beyond basic chat prompts into engineering robust production prompt pipelines, reasoning architectures (CoT, ReAct), JSON schema enforcement, and vulnerability red-teaming.',
    highlights: ['Chain-of-Thought (CoT)', 'Few-Shot / Zero-Shot', 'Structured JSON Outputs', 'Prompt Security & Red Teaming'],
    modules: [
      {
        title: 'Module 1: Mechanics of Foundation Models',
        topics: ['Context Windows & Attention Decay', 'Decoding Parameters (Temperature, Top-p, Top-k)', 'System vs User vs Assistant Messages', 'Prompt Token Economics']
      },
      {
        title: 'Module 2: Advanced Reasoning Methodologies',
        topics: ['Chain-of-Thought (CoT) Prompting', 'Few-Shot Learning with Curated Exemplars', 'ReAct (Reason + Act) Pattern', 'Tree-of-Thoughts & Self-Consistency']
      },
      {
        title: 'Module 3: Structured Outputs & Function Calling',
        topics: ['JSON Mode & Schema Enforcement', 'Pydantic & Tool Call Signatures', 'Deterministic Parsing Techniques', 'Error Recovery & Self-Correction Loops']
      },
      {
        title: 'Module 4: Prompt Security & Evaluation Benchmarks',
        topics: ['Prompt Injection & Jailbreak Defense', 'System Prompt Leakage Prevention', 'Automated Prompt Evaluation & LLM-as-a-Judge', 'Enterprise Guardrails Integration']
      }
    ],
    targetAudience: 'Developers, product managers, and analysts optimizing production LLM interactions.',
    prerequisites: 'Curiosity and fundamental computer literacy. Basic programming is helpful.',
    outcomes: ['Design reliable production prompts', 'Enforce schema outputs deterministically', 'Harden systems against adversarial injections']
  },
  {
    id: 'agentic-ai-rag',
    title: 'Agentic AI & RAG',
    category: 'AI & Machine Learning',
    badge: 'High Demand',
    icon: Network,
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
    borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
    summary: 'Build autonomous multi-agent swarms, tool-calling pipelines, and production RAG systems.',
    description: 'Step into the vanguard of AI development. Learn how to architect vector retrieval pipelines, hybrid search, semantic chunking, and multi-agent coordination frameworks.',
    highlights: ['Vector Databases', 'Hybrid Retrieval RAG', 'LangGraph & CrewAI', 'Autonomous Tool Execution'],
    modules: [
      {
        title: 'Module 1: Embeddings & Vector Store Architecture',
        topics: ['Vector Similarity (Cosine, Dot Product)', 'Embedding Models & Dimensionality', 'Vector DBs (Chroma, Pinecone, Qdrant)', 'Hierarchical & Semantic Chunking']
      },
      {
        title: 'Module 2: Advanced RAG Patterns',
        topics: ['Query Rewriting & Multi-Query Expansion', 'Hybrid Search (Dense + Sparse BM25)', 'Cross-Encoder Re-Ranking', 'Context Precision & Hallucination Mitigation']
      },
      {
        title: 'Module 3: Agentic Architecture & Orchestration',
        topics: ['Agent Memory (Short-Term, Long-Term, Working)', 'Tool Binding & Autonomous Decision Trees', 'LangGraph Stateful Workflows', 'Multi-Agent Collaboration with CrewAI']
      },
      {
        title: 'Module 4: Production Observability & Evaluation',
        topics: ['RAG Triad Metrics (Context Relevance, Groundedness)', 'Tracing Agent Steps with LangSmith/Phoenix', 'Latency & Token Cost Optimization', 'Enterprise Knowledge Assistant Capstone']
      }
    ],
    targetAudience: 'Software engineers wanting to build production-grade autonomous agent and search systems.',
    prerequisites: 'Proficiency in Python and basic REST API familiarity.',
    outcomes: ['Construct end-to-end enterprise RAG', 'Deploy autonomous multi-agent pipelines', 'Evaluate and benchmark retrieval accuracy']
  },
  {
    id: 'nlp-large-language-models',
    title: 'NLP & Large Language Models',
    category: 'AI & Machine Learning',
    badge: 'Core AI',
    icon: BookOpen,
    gradient: 'from-cyan-600 via-teal-600 to-emerald-600',
    badgeStyle: 'bg-teal-50 text-teal-700 border-teal-200',
    borderHover: 'hover:border-teal-400 hover:shadow-teal-500/10',
    summary: 'Master natural language processing from tokens to transformers and fine-tuning open LLMs.',
    description: 'A deep technical exploration of computational linguistics, subword tokenization, attention mechanisms, BERT/GPT architectures, and parameter-efficient fine-tuning (LoRA/QLoRA).',
    highlights: ['Tokenization & Word Vectors', 'Transformer Internals', 'LoRA / QLoRA Fine-Tuning', 'Hugging Face Ecosystem'],
    modules: [
      {
        title: 'Module 1: Traditional & Neural NLP',
        topics: ['Subword Tokenization (BPE, WordPiece)', 'Word Embeddings (Word2Vec, FastText)', 'Sequence Tagging (NER, POS)', 'Text Classification Pipelines']
      },
      {
        title: 'Module 2: Transformers Deep Dive',
        topics: ['Multi-Head Self-Attention Calculation', 'Positional Encodings (RoPE, ALiBi)', 'BERT (Encoder) vs GPT (Decoder)', 'Hugging Face Transformers Library']
      },
      {
        title: 'Module 3: Parameter-Efficient Fine-Tuning (PEFT)',
        topics: ['Low-Rank Adaptation (LoRA)', '4-bit Quantization (QLoRA)', 'Instruction Dataset Formatting', 'Compute Optimization with Accelerate & DeepSpeed']
      },
      {
        title: 'Module 4: Alignment & Evaluation',
        topics: ['Direct Preference Optimization (DPO)', 'Reward Modeling & RLHF Basics', 'Perplexity & Benchmark Suites (MMLU, GSM8K)', 'Deploying with vLLM & Ollama']
      }
    ],
    targetAudience: 'ML engineers, data scientists, and computational linguistics enthusiasts.',
    prerequisites: 'Python and baseline machine learning / deep learning knowledge.',
    outcomes: ['Deep grasp of transformer mathematics', 'Fine-tune domain-specific LLMs with LoRA', 'Deploy high-throughput inference engines']
  },

  // --- 2. Software & Full Stack Development Track ---
  {
    id: 'full-stack-development',
    title: 'Full Stack Development',
    category: 'Software & Full Stack',
    badge: 'Popular',
    icon: Layers,
    gradient: 'from-blue-600 via-cyan-600 to-sky-600',
    badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
    borderHover: 'hover:border-sky-400 hover:shadow-sky-500/10',
    summary: 'Build robust, responsive modern web applications with React, Node.js, and cloud databases.',
    description: 'From interactive client-side experiences to scalable backend microservices, master full stack engineering using modern TypeScript, React, Express, MongoDB, and automated deployment.',
    highlights: ['React & TypeScript', 'Node.js & Express', 'MongoDB & PostgreSQL', 'Cloud & CI/CD Pipelines'],
    modules: [
      {
        title: 'Module 1: Modern Frontend Architecture',
        topics: ['HTML5 Semantic Structure & Modern CSS/Tailwind', 'React 18+ Components, Hooks & Lifecycle', 'TypeScript for Type-Safe UI Development', 'State Management & Client Routing']
      },
      {
        title: 'Module 2: Backend & RESTful Services',
        topics: ['Node.js Runtime & Event Loop', 'Express.js Server Architecture', 'RESTful API Design & OpenAPI Spec', 'JWT Authentication & Role-Based Access Control']
      },
      {
        title: 'Module 3: Databases & Data Modeling',
        topics: ['Relational Design with PostgreSQL', 'NoSQL Flexibility with MongoDB', 'ORM / ODM (Prisma, Mongoose)', 'Transactions, Indexes & Optimization']
      },
      {
        title: 'Module 4: Deployment & DevOps Essentials',
        topics: ['Git Version Control & Collaboration', 'Containerization with Docker', 'CI/CD with GitHub Actions', 'Production Cloud Hosting & Monitoring']
      }
    ],
    targetAudience: 'Aspiring web developers, graduates, and professionals building complete software products.',
    prerequisites: 'Basic familiarity with computer usage. No prior programming needed.',
    outcomes: ['Develop full stack web applications', 'Implement secure authentication and APIs', 'Deploy production software independently']
  },
  {
    id: 'java-full-stack',
    title: 'Java Full Stack',
    category: 'Software & Full Stack',
    badge: 'Enterprise',
    icon: Server,
    gradient: 'from-red-600 via-amber-600 to-orange-600',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
    summary: 'Enterprise software development featuring Java 17+, Spring Boot microservices, and modern UI.',
    description: 'Designed for enterprise excellence. Master the Java ecosystem, Spring Boot, Spring Security, Hibernate persistence, REST architecture, and integration with modern frontend interfaces.',
    highlights: ['Java 17+ Enterprise', 'Spring Boot Microservices', 'Hibernate & JPA', 'Spring Security & JWT'],
    modules: [
      {
        title: 'Module 1: Core & Modern Java Mastery',
        topics: ['OOP Foundations, Interfaces & Abstract Classes', 'Collections Framework & Generics', 'Java Streams API & Lambda Expressions', 'Exception Handling & Multi-threading']
      },
      {
        title: 'Module 2: Spring Boot & Enterprise Services',
        topics: ['Dependency Injection & IoC Container', 'Spring MVC & RESTful Controller Design', 'Validation, Logging & Configuration Profiles', 'Microservices Architecture Fundamentals']
      },
      {
        title: 'Module 3: Persistence with Hibernate & JPA',
        topics: ['Object-Relational Mapping (ORM)', 'Spring Data JPA Repositories', 'Transaction Management (@Transactional)', 'Connection Pooling & Database Migrations (Flyway)']
      },
      {
        title: 'Module 4: Security, Testing & Full Stack Integration',
        topics: ['Spring Security 6 with JWT Authentication', 'Unit & Integration Testing with JUnit 5 & Mockito', 'Consuming APIs with React Frontend', 'Dockerizing Spring Boot Services']
      }
    ],
    targetAudience: 'Engineers targeting enterprise software roles, banking/fintech, and large-scale systems.',
    prerequisites: 'Basic understanding of object-oriented principles or basic programming.',
    outcomes: ['Build enterprise Spring Boot microservices', 'Design robust relational database schemas', 'Deploy secure enterprise applications']
  },
  {
    id: 'python-development',
    title: 'Python Development',
    category: 'Software & Full Stack',
    badge: 'Versatile',
    icon: Terminal,
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
    summary: 'Advanced Python engineering, asynchronous programming, FastAPI web services, and automation.',
    description: 'From clean code idiomatic Python to asynchronous web backends and automation tooling, gain deep proficiency in the world’s most versatile programming language.',
    highlights: ['Idiomatic Python 3.12+', 'FastAPI & Asyncio', 'OOP & Design Patterns', 'Automated Testing & CLI'],
    modules: [
      {
        title: 'Module 1: Advanced Python & Clean Code',
        topics: ['Iterators, Generators & Comprehensions', 'Decorators & Context Managers', 'OOP, Dunder Methods & Metaclasses', 'Type Annotations & Pydantic Data Models']
      },
      {
        title: 'Module 2: High-Performance Asyncio & Concurrency',
        topics: ['Event Loops & Async/Await Primitives', 'Concurrent Tasks & Gather', 'Threading vs Multiprocessing', 'Asynchronous HTTP & File I/O']
      },
      {
        title: 'Module 3: Modern Web APIs with FastAPI',
        topics: ['FastAPI Routing & Dependency Injection', 'SQLAlchemy 2.0 Async ORM', 'Request Validation & Swagger Documentation', 'Background Tasks & WebSockets']
      },
      {
        title: 'Module 4: Packaging, Testing & Automation',
        topics: ['Writing Test Suites with Pytest & Mocking', 'Building CLI Tools with Typer/Click', 'Automating Web Scraping & System Tasks', 'Publishing Packages & Virtual Environments']
      }
    ],
    targetAudience: 'Developers seeking thorough mastery of Python for backend, automation, and general engineering.',
    prerequisites: 'Curiosity and eagerness to code. Suitable for beginners to intermediate learners.',
    outcomes: ['Write clean, idiomatic, typed Python', 'Build blazing-fast async FastAPI services', 'Automate complex real-world workflows']
  },
  {
    id: 'data-structures-algorithms',
    title: 'Data Structures & Algorithms',
    category: 'Software & Full Stack',
    badge: 'Interview Ready',
    icon: GitBranch,
    gradient: 'from-indigo-600 via-blue-600 to-cyan-600',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    borderHover: 'hover:border-indigo-400 hover:shadow-indigo-500/10',
    summary: 'Problem-solving rigor, algorithmic optimization, and technical coding interview excellence.',
    description: 'Master core algorithmic problem-solving paradigms from dynamic programming to graph traversals. Built to prepare engineers for technical interviews at top-tier tech companies.',
    highlights: ['Arrays, Trees & Graphs', 'Dynamic Programming', 'Big-O Complexity Optimization', 'FAANG-Style Interview Prep'],
    modules: [
      {
        title: 'Module 1: Foundations & Linear Structures',
        topics: ['Asymptotic Analysis (Big-O, Omega, Theta)', 'Dynamic Arrays & String Manipulation', 'Linked Lists, Stacks & Queues', 'Two Pointers & Sliding Window Patterns']
      },
      {
        title: 'Module 2: Hierarchical Structures & Searching',
        topics: ['Binary Trees & Binary Search Trees (BST)', 'Heaps & Priority Queues', 'Hashing & Collision Resolution', 'Divide and Conquer & Binary Search Variations']
      },
      {
        title: 'Module 3: Graph Algorithms',
        topics: ['Breadth-First Search (BFS) & Depth-First Search (DFS)', 'Shortest Path (Dijkstra, Bellman-Ford)', 'Disjoint Set Union (Union-Find)', 'Topological Sorting & Minimum Spanning Trees']
      },
      {
        title: 'Module 4: Dynamic Programming & Advanced Strategies',
        topics: ['1D & 2D Dynamic Programming Patterns', 'Memoization vs Tabulation', 'Knapsack, Subsequence & Partition Problems', 'Bitmasking, Backtracking & Interview Drills']
      }
    ],
    targetAudience: 'Computer science students and engineers preparing for competitive coding and technical hiring rounds.',
    prerequisites: 'Working knowledge of any programming language (C++, Java, or Python).',
    outcomes: ['Solve medium/hard algorithmic challenges', 'Analyze time & space trade-offs accurately', 'Ace top-tier technical interviews']
  },

  // --- 3. Embedded Systems & Core Electronics Track ---
  {
    id: 'c-programming',
    title: 'C Programming',
    category: 'Embedded & Electronics',
    badge: 'Systems Core',
    icon: Code,
    gradient: 'from-slate-700 via-gray-800 to-zinc-900',
    badgeStyle: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    borderHover: 'hover:border-zinc-400 hover:shadow-zinc-500/10',
    summary: 'The foundational bedrock of low-level systems programming, pointers, and memory manipulation.',
    description: 'Master the language that powers operating systems, embedded devices, and hardware drivers. Understand memory layouts, stack vs heap, pointers, bitwise arithmetic, and low-level algorithms.',
    highlights: ['Pointers & Pointer Arithmetic', 'Dynamic Memory Management', 'Structures, Unions & Bitfields', 'Embedded C Foundations'],
    modules: [
      {
        title: 'Module 1: Syntax & Memory Layout',
        topics: ['Data Types, Qualifiers (const, volatile)', 'Operators & Bitwise Mechanics', 'Compilation Pipeline (Preprocessor, Compiler, Linker)', 'Stack vs Heap Memory Breakdown']
      },
      {
        title: 'Module 2: Pointers & Deep Memory Control',
        topics: ['Pointer Declarations & Dereferencing', 'Pointer Arithmetic & Array Equivalences', 'Double Pointers & Function Pointers', 'Dynamic Memory Allocation (malloc, calloc, realloc, free)']
      },
      {
        title: 'Module 3: Complex Types & Data Structures',
        topics: ['Structures & Padding/Alignment', 'Unions & Bitfields for Hardware Registers', 'Building Linked Lists, Stacks & Queues in C', 'String Manipulation at the Byte Level']
      },
      {
        title: 'Module 4: File I/O & Embedded C Techniques',
        topics: ['Binary File Operations (fread/fwrite)', 'Modular Programming & Header Files (.h/.c)', 'Volatile Keyword in Hardware Registers', 'Debugging Memory Leaks with Valgrind/GDB']
      }
    ],
    targetAudience: 'Engineers entering embedded systems, IoT, OS kernel engineering, and high-performance computing.',
    prerequisites: 'No prior coding experience required. High school math is sufficient.',
    outcomes: ['Master pointer memory arithmetic', 'Write bug-free, leak-free C code', 'Lay the foundation for embedded firmware']
  },
  {
    id: 'cpp-programming',
    title: 'C++',
    category: 'Embedded & Electronics',
    badge: 'High Performance',
    icon: Cpu,
    gradient: 'from-blue-700 via-indigo-700 to-sky-800',
    badgeStyle: 'bg-blue-50 text-blue-800 border-blue-200',
    borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
    summary: 'Modern high-performance C++ (C++17/20), OOP design, STL containers, and low-latency programming.',
    description: 'Harness the immense power of modern C++. Learn object-oriented architecture, template metaprogramming, the Standard Template Library, smart pointers, RAII, and zero-cost abstractions.',
    highlights: ['Modern C++ (17/20)', 'STL Containers & Algorithms', 'Smart Pointers & RAII', 'Zero-Cost Abstractions'],
    modules: [
      {
        title: 'Module 1: Object-Oriented C++ Architecture',
        topics: ['Classes, Encapsulation & Access Specifiers', 'Constructors, Destructors & Rule of Five', 'Inheritance & Virtual Functions (vtable)', 'Polymorphism & Abstract Interfaces']
      },
      {
        title: 'Module 2: Standard Template Library (STL)',
        topics: ['Sequence Containers (vector, deque, list)', 'Associative Containers (set, map, unordered_map)', 'Iterators & Custom Functors', 'STL Algorithms (sort, binary_search, transform)']
      },
      {
        title: 'Module 3: Memory Safety & Modern Idioms',
        topics: ['RAII (Resource Acquisition Is Initialization)', 'Smart Pointers (unique_ptr, shared_ptr, weak_ptr)', 'Move Semantics & Rvalue References (std::move)', 'Lambdas & Functional Interfaces']
      },
      {
        title: 'Module 4: Advanced Systems & Concurrency',
        topics: ['Template Metaprogramming & Concepts', 'C++ Threading & Mutexes (std::thread, std::async)', 'Atomic Operations & Lock-Free Basics', 'Writing Low-Latency Embedded Code']
      }
    ],
    targetAudience: 'Programmers aiming for high-performance software, gaming engines, robotics, or automotive systems.',
    prerequisites: 'Foundational understanding of C or another procedural programming language.',
    outcomes: ['Write modern, idiomatic C++ code', 'Leverage STL for complex problem solving', 'Manage hardware resources safely with RAII']
  },
  {
    id: 'linux-systems',
    title: 'Linux',
    category: 'Embedded & Electronics',
    badge: 'Industry Essential',
    icon: Terminal,
    gradient: 'from-amber-600 via-orange-600 to-yellow-600',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
    summary: 'Operating system architecture, Bash scripting, POSIX system calls, and system administration.',
    description: 'Master the operating system that runs the modern cloud and embedded smart devices. Gain command-line wizardry, bash automation, process/memory inspection, and kernel fundamentals.',
    highlights: ['Bash Automation', 'POSIX System Calls', 'Process & Thread Management', 'Kernel Architecture'],
    modules: [
      {
        title: 'Module 1: Command Line Proficiency & Text Processing',
        topics: ['File System Hierarchy (FHS) & Navigation', 'Text Processing (grep, sed, awk)', 'Pipes, Redirection & File Descriptors', 'Permissions, ACLs & Ownership Management']
      },
      {
        title: 'Module 2: Shell Scripting Automation',
        topics: ['Bash Variables, Control Structures & Loops', 'Functions & Argument Parsing', 'Cron Jobs & Scheduled Automation', 'Writing Production Maintenance Scripts']
      },
      {
        title: 'Module 3: Systems Administration & Services',
        topics: ['Process Monitoring (ps, top, htop, systemd)', 'Managing Services & Daemons with systemctl', 'Networking Tools (ip, netstat, ssh, iptables)', 'Package Managers & User Group Administration']
      },
      {
        title: 'Module 4: POSIX System Programming Basics',
        topics: ['Process Creation (fork, exec, wait)', 'Inter-Process Communication (Pipes, Sockets)', 'Signals & Handlers', 'Embedded Linux Intro (Bootloaders, BusyBox)']
      }
    ],
    targetAudience: 'Engineers, DevOps specialists, and embedded developers building on Linux.',
    prerequisites: 'Basic computer literacy.',
    outcomes: ['Automate repetitive tasks with Bash', 'Diagnose and administer Linux servers', 'Understand POSIX OS mechanics']
  },
  {
    id: 'communication-protocols',
    title: 'Communication Protocols',
    category: 'Embedded & Electronics',
    badge: 'Embedded Protocol',
    icon: Radio,
    gradient: 'from-violet-600 via-indigo-600 to-blue-600',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    borderHover: 'hover:border-indigo-400 hover:shadow-indigo-500/10',
    summary: 'Master embedded and industrial communication standards: UART, SPI, I2C, CAN Bus, and Modbus.',
    description: 'A deep dive into how microcontrollers talk to sensors, actuators, automotive modules, and industrial machinery. Master packet framing, bit-timing, hardware line levels, and logic analyzer debugging.',
    highlights: ['UART, SPI & I2C', 'CAN Bus (Automotive)', 'Industrial Modbus & RS-485', 'Logic Analyzer Debugging'],
    modules: [
      {
        title: 'Module 1: Serial Asynchronous - UART/USART',
        topics: ['Baud Rate Generation & Oversampling', 'Start/Stop Bits, Parity & Frame Errors', 'Buffer Management & Ring Buffers with Interrupts', 'RS-232 & RS-485 Differential Standards']
      },
      {
        title: 'Module 2: Synchronous Serial Buses - SPI & I2C',
        topics: ['SPI: Clock Polarity/Phase (CPOL/CPHA), Master-Slave', 'I2C: 7-bit/10-bit Addressing, Pull-Up Resistors, ACK/NACK', 'Clock Stretching, Multi-Master Arbitration', 'Interfacing EEPROMs, RTCs & IMUs']
      },
      {
        title: 'Module 3: Automotive Standard - CAN Bus',
        topics: ['CAN 2.0A/B Architecture & Differential Signaling', 'Message Framing (Identifier, RTR, DLC, CRC)', 'Non-Destructive Bitwise Arbitration', 'Transceivers, Termination Resistors & CAN-FD']
      },
      {
        title: 'Module 4: Industrial Protocols & Debugging Tools',
        topics: ['Modbus RTU over RS-485 & Register Formats', 'Using Digital Logic Analyzers to Decode Packets', 'Oscilloscope Signal Integrity Verification', 'Writing Robust Packet Framing Drivers']
      }
    ],
    targetAudience: 'Hardware engineers, automotive firmware developers, and IoT embedded developers.',
    prerequisites: 'Basic knowledge of digital signals and C programming.',
    outcomes: ['Write reliable drivers for SPI, I2C & UART', 'Design robust CAN communication networks', 'Debug protocol issues with logic analyzers']
  },
  {
    id: 'arm-cortex',
    title: 'ARM Cortex',
    category: 'Embedded & Electronics',
    badge: 'Industry Standard',
    icon: Cpu,
    gradient: 'from-rose-600 via-orange-600 to-amber-600',
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    borderHover: 'hover:border-rose-400 hover:shadow-rose-500/10',
    summary: 'Microarchitecture, NVIC interrupt handling, CMSIS, and bare-metal programming for Cortex-M.',
    description: 'ARM Cortex powers the vast majority of modern 32-bit embedded systems. Learn the Cortex-M processor architecture, registers, exception vectors, SysTick timer, and bare-metal peripheral drivers.',
    highlights: ['Cortex-M Architecture', 'CMSIS Standards', 'NVIC & Interrupts', 'Bare-Metal Drivers'],
    modules: [
      {
        title: 'Module 1: Cortex-M Architecture & Programmer Model',
        topics: ['Core Registers (R0-R15, xPSR, MSP/PSP)', 'Thumb-2 Instruction Set Overview', 'Privileged vs Unprivileged Modes', 'Memory Map & Bus Architecture (AHB, APB)']
      },
      {
        title: 'Module 2: Startup Sequence & Vector Table',
        topics: ['Reset Sequence from Power-On', 'Vector Table Relocation (VTOR)', 'Linker Scripts & Memory Section Mapping (.text, .data, .bss)', 'Writing Minimal Startup Code in Assembly/C']
      },
      {
        title: 'Module 3: Nested Vectored Interrupt Controller (NVIC)',
        topics: ['Interrupt Priorities & Preemption/Sub-Priority', 'Tail-Chaining & Late-Arrival Optimization', 'Writing Interrupt Service Routines (ISRs)', 'SysTick Timer Configuration & Real-Time Ticks']
      },
      {
        title: 'Module 4: CMSIS & Peripheral Driver Engineering',
        topics: ['CMSIS-Core Register Definitions', 'Configuring Phase-Locked Loops (PLL) & Clocks', 'Direct Memory Access (DMA) Controllers', 'Bare-Metal Driver Development for Timers & GPIO']
      }
    ],
    targetAudience: 'Firmware engineers, robotics specialists, and electronics graduates targeting 32-bit microcontrollers.',
    prerequisites: 'C Programming fundamentals.',
    outcomes: ['Understand ARM Cortex-M internals', 'Configure complex clocks and NVIC interrupts', 'Write production bare-metal drivers']
  },
  {
    id: 'microcontroller-microprocessor',
    title: 'Microcontroller and Microprocessor',
    category: 'Embedded & Electronics',
    badge: 'Hardware Core',
    icon: CircuitBoard,
    gradient: 'from-teal-600 via-cyan-700 to-blue-700',
    badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200',
    borderHover: 'hover:border-teal-400 hover:shadow-teal-500/10',
    summary: 'Core differences, architecture, memory hierarchies, GPIO control, ADC/DAC, and hardware interfaces.',
    description: 'Understand the fundamental architectural divergence between microcontrollers (MCU) and microprocessors (MPU). Master hardware abstraction, peripheral registers, timers, and real-world hardware interfacing.',
    highlights: ['MCU vs MPU Architectures', 'GPIO & Timer Subsystems', 'ADC/DAC Peripheral Control', 'Hardware Abstraction (HAL)'],
    modules: [
      {
        title: 'Module 1: MCU vs MPU Architectural Foundations',
        topics: ['Harvard vs Von Neumann Architectures', 'RISC vs CISC Computing Concepts', 'Internal Memory vs External RAM/Flash Interfaces', 'Power Regimes & Operating Frequencies']
      },
      {
        title: 'Module 2: GPIO & General Purpose Subsystems',
        topics: ['Input, Output, Open-Drain & Push-Pull Modes', 'Internal Pull-Up & Pull-Down Resistors', 'External Interrupts & Debouncing Techniques', 'Controlling LEDs, Relays & Transistor Gates']
      },
      {
        title: 'Module 3: Timers, Counters & PWM Generation',
        topics: ['Prescalers & Counter Registers', 'Output Compare & Pulse Width Modulation (PWM)', 'Input Capture for Frequency/Pulse Measurement', 'Watchdog Timers for System Reliability']
      },
      {
        title: 'Module 4: Analog Peripherals & Peripheral Interfacing',
        topics: ['Analog-to-Digital Converters (ADC) Sampling & Channels', 'Digital-to-Analog Converters (DAC)', 'Direct Hardware Interfacing (LCD/OLED, Sensors, Motors)', 'Hardware Abstraction Layer (HAL) vs Direct Register Programming']
      }
    ],
    targetAudience: 'ECE, EEE, Robotics students and engineers transitioning from software into physical electronics.',
    prerequisites: 'Basic knowledge of basic electricity and introductory C programming.',
    outcomes: ['Differentiate MCU and MPU hardware architectures', 'Interface analog and digital sensors accurately', 'Generate precision PWM and timer signals']
  },
  {
    id: 'digital-electronics',
    title: 'Digital Electronics',
    category: 'Embedded & Electronics',
    badge: 'Hardware Logic',
    icon: Zap,
    gradient: 'from-amber-500 via-yellow-600 to-orange-600',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
    summary: 'Boolean algebra, logic gates, combinational circuits, flip-flops, and finite state machines.',
    description: 'From fundamental silicon switches to complex synchronous state machines, master the theoretical and practical foundations of all digital computing systems and hardware logic.',
    highlights: ['Boolean Logic & K-Maps', 'Combinational Circuit Design', 'Sequential Flip-Flops', 'Finite State Machines (FSM)'],
    modules: [
      {
        title: 'Module 1: Number Systems & Boolean Foundations',
        topics: ['Binary, Octal, Hexadecimal & Two’s Complement', 'Logic Gates (AND, OR, NOT, NAND, NOR, XOR)', 'Boolean Laws & De Morgan’s Theorems', 'Karnaugh Maps (K-Maps) Minimization']
      },
      {
        title: 'Module 2: Combinational Logic Circuits',
        topics: ['Half & Full Adders / Subtractors', 'Multiplexers & Demultiplexers', 'Priority Encoders & 7-Segment Decoders', 'ALU (Arithmetic Logic Unit) Building Blocks']
      },
      {
        title: 'Module 3: Sequential Logic & Memory Elements',
        topics: ['Latches vs Edge-Triggered Flip-Flops (SR, JK, D, T)', 'Setup & Hold Times, Metastability', 'Synchronous & Asynchronous Binary Counters', 'Shift Registers (SISO, SIPO, PISO, PIPO)']
      },
      {
        title: 'Module 4: Synchronous State Machines & Verilog Intro',
        topics: ['Mealy vs Moore Finite State Machine Design', 'State Diagram, State Table & State Assignment', 'Timing Analysis & Clock Domain Basics', 'Introduction to Hardware Description with Verilog HDL']
      }
    ],
    targetAudience: 'Electrical and electronics engineering students, FPGA enthusiasts, and VLSI aspirants.',
    prerequisites: 'High school math and basic logic.',
    outcomes: ['Design optimal combinational logic', 'Build synchronous state machines', 'Prepare for FPGA and digital VLSI design']
  },
  {
    id: 'analog-electronics',
    title: 'Analog Electronics',
    category: 'Embedded & Electronics',
    badge: 'Circuit Core',
    icon: Activity,
    gradient: 'from-emerald-600 via-teal-700 to-green-700',
    badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
    summary: 'Operational amplifiers, discrete BJT & MOSFET circuits, active filters, and circuit simulation.',
    description: 'Every physical signal begins in the analog domain. Master discrete semiconductor physics, transistors as amplifiers and switches, operational amplifier circuits, active filtering, and SPICE simulation.',
    highlights: ['Operational Amplifiers (Op-Amps)', 'BJT & MOSFET Transistors', 'Active & Passive Filters', 'SPICE Circuit Simulation'],
    modules: [
      {
        title: 'Module 1: Diodes & Power Supply Design',
        topics: ['PN Junction Physics & Diode Equation', 'Half-Wave, Full-Wave & Bridge Rectifiers', 'Zener Diodes & Voltage Regulation', 'Linear Regulators (LM78xx) & Decoupling']
      },
      {
        title: 'Module 2: Discrete Transistors - BJT & MOSFET',
        topics: ['BJT Biasing & Common-Emitter Amplifier', 'MOSFET Operation (Enhancement vs Depletion)', 'Transistors as High-Speed Electronic Switches', 'Small-Signal Analysis & Frequency Response']
      },
      {
        title: 'Module 3: Operational Amplifiers (Op-Amps)',
        topics: ['Ideal vs Real Op-Amp Parameters (CMRR, Slew Rate)', 'Inverting, Non-Inverting & Buffer Configurations', 'Summing, Difference & Instrumentation Amplifiers', 'Comparators with Hysteresis (Schmitt Trigger)']
      },
      {
        title: 'Module 4: Active Filters & Circuit Simulation',
        topics: ['Low-Pass, High-Pass & Band-Pass Active Filters', 'Butterworth Filter Transfer Functions', 'Sensor Conditioning for ADC Microcontrollers', 'Circuit Simulation & Analysis with LTspice']
      }
    ],
    targetAudience: 'Hardware engineers, IoT device builders, and students wanting mastery of real-world circuit design.',
    prerequisites: 'Basic concepts of electric current, voltage, and Ohm’s Law.',
    outcomes: ['Design clean operational amplifier circuits', 'Condition analog sensor signals for microcontrollers', 'Simulate and verify hardware using SPICE']
  },
  {
    id: 'embedded-systems',
    title: 'Embedded Systems',
    category: 'Embedded & Electronics',
    badge: 'Full Stack Hardware',
    icon: Layers,
    gradient: 'from-orange-600 via-amber-600 to-red-600',
    badgeStyle: 'bg-orange-50 text-orange-800 border-orange-200',
    borderHover: 'hover:border-orange-400 hover:shadow-orange-500/10',
    summary: 'End-to-end embedded engineering: firmware, real-time operating systems (FreeRTOS), sensors, and IoT.',
    description: 'The premier synthesis of hardware and software. Learn how to architect real-time embedded firmware, multithread with FreeRTOS, integrate complex sensor suites, and debug embedded prototypes.',
    highlights: ['FreeRTOS Multitasking', 'Device Driver Architecture', 'Sensor & Actuator Suites', 'Hardware In-Circuit Debugging'],
    modules: [
      {
        title: 'Module 1: Embedded System Architecture & Life Cycle',
        topics: ['Embedded System Hardware-Software Co-Design', 'Clock Trees, Power Domains & Sleep Modes', 'Memory Layout & Memory-Mapped Peripheral I/O', 'Writing Clean, Modular Firmware Architecture']
      },
      {
        title: 'Module 2: Real-Time Operating Systems (FreeRTOS)',
        topics: ['RTOS Fundamentals: Superloop vs Preemptive Kernel', 'Task Creation, Priorities & Context Switching', 'Inter-Task Synchronization (Semaphores & Mutexes)', 'Message Queues, Event Groups & Software Timers']
      },
      {
        title: 'Module 3: Sensor Integration & Signal Acquisition',
        topics: ['Interfacing Accelerometers, Gyros & Environmental Sensors', 'Interrupt-Driven Data Acquisition Pipelines', 'Actuator Control (DC Motors, Steppers, Servos)', 'Low-Power Design & Battery Management']
      },
      {
        title: 'Module 4: Production Firmware & Debugging',
        topics: ['Hardware Debugging with JTAG/SWD & Breakpoints', 'Watchdog Timers & Hard Fault Handler Diagnostics', 'Bootloaders & Firmware Over-the-Air (FOTA) Basics', 'Comprehensive IoT Capstone Build']
      }
    ],
    targetAudience: 'Engineers who want to build commercial embedded products, smart devices, robotics, and IoT solutions.',
    prerequisites: 'Foundational C programming and basic microcontroller concepts.',
    outcomes: ['Develop multitasking firmware with FreeRTOS', 'Interface complex multi-sensor systems', 'Debug and deploy industrial embedded hardware']
  }
];

export default function Programs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<CourseProgram | null>(null);
  const [selectedCourseForInquiry, setSelectedCourseForInquiry] = useState<CourseProgram | null>(null);

  // Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    message: ''
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  const categories = ['All', 'AI & Machine Learning', 'Software & Full Stack', 'Embedded & Electronics'];

  const filteredPrograms = useMemo(() => {
    return STATIC_PROGRAMS.filter((prog) => {
      const matchesCategory = selectedCategory === 'All' || prog.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        prog.title.toLowerCase().includes(q) ||
        prog.summary.toLowerCase().includes(q) ||
        prog.description.toLowerCase().includes(q) ||
        prog.highlights.some((h) => h.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle ESC key to close modals and body scroll locking
  useEffect(() => {
    if (!selectedCourseForDetails && !selectedCourseForInquiry) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCourseForDetails(null);
        setSelectedCourseForInquiry(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCourseForDetails, selectedCourseForInquiry]);

  const handleOpenInquiry = (course: CourseProgram) => {
    setSelectedCourseForInquiry(course);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inquiryForm.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    const cleanPhone = inquiryForm.phone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setSubmittingInquiry(true);
    try {
      await addDoc(collection(db, 'course_inquiries'), {
        courseId: selectedCourseForInquiry?.id || 'general',
        courseTitle: selectedCourseForInquiry?.title || 'General Inquiry',
        courseCategory: selectedCourseForInquiry?.category || '',
        fullName: inquiryForm.fullName.trim(),
        email: inquiryForm.email.trim(),
        phone: cleanPhone,
        college: inquiryForm.college.trim(),
        message: inquiryForm.message.trim(),
        createdAt: Timestamp.now(),
        status: 'pending'
      });

      toast.success(`Inquiry submitted for ${selectedCourseForInquiry?.title}! Our team will get in touch with you shortly.`);
      setInquiryForm({
        fullName: '',
        email: '',
        phone: '',
        college: '',
        message: ''
      });
      setSelectedCourseForInquiry(null);
    } catch (error) {
      console.error('Error submitting course inquiry:', error);
      toast.success('Your interest has been recorded! Our academic advisor will contact you.');
      setSelectedCourseForInquiry(null);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-gray-100 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Ambient Glowing Orbs */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-80 h-80 sm:w-[480px] sm:h-[480px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 30, -30, 0],
            scale: [1, 1.15, 1, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-20 -right-20 w-80 h-80 sm:w-[480px] sm:h-[480px] bg-orange-600/15 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Industry-Standard Curriculum & Practical Mentorship</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            Explore Our{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Training Programs
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
          >
            Hands-on technical courses spanning Next-Gen Artificial Intelligence, Enterprise Software Development,
            and Core Embedded Electronics designed to bridge the gap between academic study and high-growth industry careers.
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left"
          >
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 sm:p-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">18+</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Specialized Courses</div>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 sm:p-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Practical & Project-Based</div>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 sm:p-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">1-on-1</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Mentor Code Reviews</div>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 sm:p-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">Verified</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">Industry Certificates</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-[#0c121e] rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses (e.g. AI, Linux, Python, ARM, RAG)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm bg-[#111827] text-white border-white/10 placeholder-gray-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-start md:justify-end">
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? STATIC_PROGRAMS.length
                    : STATIC_PROGRAMS.filter((p) => p.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25 scale-105'
                        : 'bg-[#111827] text-gray-300 hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results summary counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{filteredPrograms.length}</strong> of{' '}
              {STATIC_PROGRAMS.length} courses
            </span>
            {searchQuery && (
              <span className="italic">
                Filtering by: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 3. COURSE CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-20 bg-[#0c121e] rounded-3xl border border-dashed border-white/20 p-8">
            <SlidersHorizontal className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No courses match your criteria</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or select another category above.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 border-white/10 text-gray-200 hover:text-white hover:bg-white/5"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPrograms.map((course, idx) => {
              const IconComponent = course.icon;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.02 }}
                  className="group relative bg-[#0c121e]/90 backdrop-blur-xl rounded-3xl border border-white/[0.08] hover:border-amber-400/40 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Ambient Trim */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

                  <div className="p-6 sm:p-7 flex-1 flex flex-col">
                    {/* Badge & Icon Row */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-400/25 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold border tracking-wider uppercase bg-amber-500/10 text-amber-300 border-amber-400/30">
                        {course.badge}
                      </span>
                    </div>

                    {/* Category Label */}
                    <p className="text-[11px] font-mono uppercase tracking-wider text-amber-400/80 mb-1.5 font-semibold">
                      {course.category}
                    </p>

                    {/* Course Title */}
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-200 mb-2 leading-snug">
                      {course.title}
                    </h3>

                    {/* Brief Summary */}
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6 line-clamp-3">
                      {course.summary}
                    </p>

                    {/* Key Topics / Highlights Pills */}
                    <div className="mt-auto pt-2">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-2 font-semibold">
                        Core Competencies:
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {course.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center text-[11px] font-medium bg-[#111927] text-gray-300 px-2.5 py-1 rounded-lg border border-white/10"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1 text-amber-400" />
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-6 py-4 bg-[#080d16] border-t border-white/[0.06] flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedCourseForDetails(course)}
                      className="text-xs font-semibold text-gray-300 hover:text-amber-400 inline-flex items-center gap-1.5 transition-colors py-2"
                    >
                      <span>View Syllabus</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <Button
                      onClick={() => handleOpenInquiry(course)}
                      size="sm"
                      className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.99]"
                    >
                      Inquire Now
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. DETAIL SYLLABUS MODAL */}
      <AnimatePresence>
        {selectedCourseForDetails && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedCourseForDetails(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#0c121e] rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] max-w-3xl w-full my-auto max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden border border-white/10 text-gray-100"
            >
              {/* Modal Header */}
              <div className="relative p-6 sm:p-8 bg-[#080d16] border-b border-white/[0.08] text-white">
                <button
                  onClick={() => setSelectedCourseForDetails(null)}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-gray-400 hover:text-white transition-colors border border-white/5"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-400/30 text-amber-300">
                    {selectedCourseForDetails.badge}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {selectedCourseForDetails.category}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {selectedCourseForDetails.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed max-w-2xl">
                  {selectedCourseForDetails.description}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
                {/* Learning Outcomes */}
                <div>
                  <h4 className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-2.5">
                    Target Learning Outcomes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedCourseForDetails.outcomes.map((out, i) => (
                      <div
                        key={i}
                        className="bg-[#090e18] border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-300 font-medium flex items-start gap-2"
                      >
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{out}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modules Syllabus */}
                <div>
                  <h4 className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-3">
                    Curriculum Modules Breakdown
                  </h4>
                  <div className="space-y-3">
                    {selectedCourseForDetails.modules.map((mod, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl border border-white/[0.08] bg-[#090e18]"
                      >
                        <h5 className="text-sm font-bold text-white mb-2.5 flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          {mod.title}
                        </h5>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                          {mod.topics.map((t, ti) => (
                            <li
                              key={ti}
                              className="text-xs text-gray-300 list-disc list-outside"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prerequisites & Audience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#090e18] border border-white/[0.06]">
                    <h5 className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Target Audience
                    </h5>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {selectedCourseForDetails.targetAudience}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090e18] border border-white/[0.06]">
                    <h5 className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Recommended Prerequisites
                    </h5>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {selectedCourseForDetails.prerequisites}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 bg-[#080d16] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-400 text-center sm:text-left">
                  Ready to enroll or need custom corporate/batch guidance?
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCourseForDetails(null)}
                    className="w-full sm:w-auto text-xs border-white/10 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      const course = selectedCourseForDetails;
                      setSelectedCourseForDetails(null);
                      setSelectedCourseForInquiry(course);
                    }}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Inquire for this Course
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. INQUIRY / ENROLLMENT APPLICATION MODAL */}
      <AnimatePresence>
        {selectedCourseForInquiry && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedCourseForInquiry(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#0c121e] rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] max-w-lg w-full my-auto max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden border border-white/10"
            >
              <div className="p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white relative">
                <button
                  onClick={() => setSelectedCourseForInquiry(null)}
                  className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-200">
                  Course Inquiry & Enrollment
                </span>
                <h3 className="text-xl font-black mt-1 text-white">
                  {selectedCourseForInquiry.title}
                </h3>
                <p className="text-xs text-white/90 mt-1">
                  Submit your details below and our academic advisory team will connect with curriculum schedules and onboarding steps.
                </p>
              </div>

              <form onSubmit={handleInquirySubmit} className="p-6 sm:p-8 space-y-4 overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={inquiryForm.fullName}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, fullName: e.target.value })
                      }
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                      Email Address <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={inquiryForm.email}
                        onChange={(e) =>
                          setInquiryForm({ ...inquiryForm, email: e.target.value })
                        }
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                      Phone Number <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={inquiryForm.phone}
                        onChange={(e) =>
                          setInquiryForm({ ...inquiryForm, phone: e.target.value })
                        }
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                    College / University / Company (Optional)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. JNTU, VIT or Company Name"
                      value={inquiryForm.college}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, college: e.target.value })
                      }
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0f1728] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                    Questions / Background Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about your learning goals or questions..."
                    value={inquiryForm.message}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, message: e.target.value })
                    }
                    className="w-full p-3 text-sm rounded-xl border border-white/10 bg-[#0f1728] text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedCourseForInquiry(null)}
                    className="text-xs border-white/10 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingInquiry}
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md px-5 h-10"
                  >
                    {submittingInquiry ? (
                      <span className="flex items-center gap-1.5">
                        <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5" />
                        Submit Inquiry
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl overflow-hidden text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              Need Career Guidance?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Looking for our Industrial Internship Program?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Join real-world client sprints, earn a verified internship certificate, and gain live deployment experience under experienced engineering mentors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <Link to="/internship">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg">
                View Internship Tracks
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/about#contact">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-slate-700 text-slate-900 bg-white hover:bg-slate-100 font-semibold px-6 py-2.5 rounded-xl"
              >
                Contact Advisors
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

